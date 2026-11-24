"""
Upload all products and categories from wishhub_products.xlsx to Supabase.
Cleans existing products, product_images, and categories first, then inserts the fresh catalog.
"""
import openpyxl
import re
import uuid
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

SUPABASE_URL = "https://efltdvrpudpfmhcldkxf.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmbHRkdnJwdWRwZm1oY2xka3hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NTE4ODQwNSwiZXhwIjoyMTEwNzY0NDA1fQ.mE8dG-dK3fm1u5KA2a1woayxNNSmfi_QQkBztKLqbOs"

session = requests.Session()
retries = Retry(total=5, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
adapter = HTTPAdapter(pool_connections=20, pool_maxsize=20, max_retries=retries)
session.mount("https://", adapter)
session.mount("http://", adapter)

HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}


def slugify(text):
    text = re.sub(r"[^\w\s-]", "", str(text).lower())
    return re.sub(r"[-\s]+", "-", text).strip("-")


def clear_existing_data():
    print("Clearing existing data from Supabase...")
    # 1. Clear product_images
    r = session.delete(f"{SUPABASE_URL}/rest/v1/product_images?id=neq.00000000-0000-0000-0000-000000000000", headers=HEADERS)
    print(f"  Deleted product_images: {r.status_code}")

    # 2. Clear products
    r = session.delete(f"{SUPABASE_URL}/rest/v1/products?id=neq.00000000-0000-0000-0000-000000000000", headers=HEADERS)
    print(f"  Deleted products: {r.status_code}")

    # 3. Clear categories
    r = session.delete(f"{SUPABASE_URL}/rest/v1/categories?id=neq.00000000-0000-0000-0000-000000000000", headers=HEADERS)
    print(f"  Deleted categories: {r.status_code}")


def load_wishhub_products():
    print("Loading wishhub_products.xlsx ...")
    wb = openpyxl.load_workbook("wishhub_products.xlsx", read_only=True)
    sheet = wb["Products"]
    rows = sheet.iter_rows(values_only=True)
    headers = next(rows)

    categories_map = {}
    products_list = []
    product_images_list = []
    seen_slugs = set()
    seen_skus = set()

    for idx, r in enumerate(rows):
        name = r[1]
        if not name:
            continue

        sku = str(r[2] or f"WH-{idx+1}").strip()
        if sku in seen_skus:
            sku = f"{sku}-{idx+1}"
        seen_skus.add(sku)
        cat_raw = str(r[3] or "Everyday Essentials").strip()

        cat_parts = [p.strip() for p in cat_raw.split(">")]
        main_cat = cat_parts[0] if cat_parts else "General"
        sub_cat = cat_parts[1] if len(cat_parts) > 1 else None

        main_cat_slug = slugify(main_cat) or "general"
        if main_cat not in categories_map:
            cat_id = str(uuid.uuid4())
            categories_map[main_cat] = {
                "id": cat_id,
                "name": main_cat,
                "slug": main_cat_slug,
                "description": f"Browse top-quality {main_cat} products at lowest prices in Pakistan.",
                "image_url": None,
                "parent_id": None,
                "display_order": len(categories_map) + 1,
                "is_active": True,
            }
        cat_id = categories_map[main_cat]["id"]

        # Parse images
        img_raw = str(r[9] or "")
        images = [url.strip().replace("http://", "https://") for url in re.split(r"[\r\n,]+", img_raw) if url.strip().startswith("http")]

        if images and not categories_map[main_cat]["image_url"]:
            categories_map[main_cat]["image_url"] = images[0]

        # Prices
        try:
            price = float(r[4]) if r[4] is not None else 999.0
        except Exception:
            price = 999.0

        try:
            old_price = float(r[5]) if r[5] is not None else None
        except Exception:
            old_price = None

        if old_price is not None and old_price <= price:
            old_price = None

        discount = round(((old_price - price) / old_price) * 100) if (old_price and old_price > price) else 0

        # Stock
        in_stock_str = str(r[6] or "").lower()
        in_stock = ("out" not in in_stock_str) and ("no" not in in_stock_str)

        # Reviews
        try:
            reviews_count = int(r[7]) if r[7] is not None else 0
        except Exception:
            reviews_count = 0

        desc = str(r[8] or "").strip()
        if not desc or len(desc) < 10:
            desc = f"Discover the premium {name}. Engineered for exceptional performance, durability, and daily convenience."

        # Slug
        safe_sku_slug = re.sub(r"[^a-z0-9-]", "", sku.lower())
        slug = f"{slugify(name)[:70]}-{safe_sku_slug}"
        slug = re.sub(r"[^a-z0-9-]", "", slug)
        if slug in seen_slugs or not slug:
            slug = f"{slug}-{idx+1}"
        seen_slugs.add(slug)

        is_featured = (idx % 12 == 0) or (reviews_count > 0 and idx % 7 == 0)
        is_bestseller = (reviews_count >= 2) or (idx % 17 == 0)
        is_trending = (discount > 20) or (idx % 19 == 0)

        rating = 4.5 if reviews_count > 1 else (4.8 if reviews_count == 1 else 4.2 + (idx % 8) * 0.1)
        rating = round(min(5.0, rating), 1)

        product_id = str(uuid.uuid4())

        products_list.append({
            "id": product_id,
            "title": name,
            "slug": slug,
            "sku": sku,
            "description": desc,
            "category_id": cat_id,
            "category_name": main_cat,
            "subcategory_name": sub_cat,
            "price": price,
            "old_price": old_price,
            "discount_percentage": discount,
            "in_stock": in_stock,
            "stock_quantity": 50 if in_stock else 0,
            "rating": rating,
            "review_count": max(reviews_count, (idx % 15) + 1),
            "is_featured": is_featured,
            "is_bestseller": is_bestseller,
            "is_trending": is_trending,
            "is_active": True,
        })

        # Add images
        for order, img_url in enumerate(images):
            product_images_list.append({
                "id": str(uuid.uuid4()),
                "product_id": product_id,
                "url": img_url,
                "display_order": order,
                "is_thumbnail": (order == 0)
            })

    return list(categories_map.values()), products_list, product_images_list


def upload_batches(table, records, batch_size=100):
    total = len(records)
    print(f"Uploading {total} records to {table} in batches of {batch_size} ...")
    for i in range(0, total, batch_size):
        batch = records[i:i + batch_size]
        r = session.post(f"{SUPABASE_URL}/rest/v1/{table}", json=batch, headers=HEADERS)
        if r.status_code not in [200, 201]:
            print(f"Error uploading to {table} (batch {i}-{i+len(batch)}): {r.status_code} - {r.text}")
            raise RuntimeError(f"Upload failed: {r.text}")
        if (i // batch_size) % 5 == 0 or (i + batch_size >= total):
            print(f"  {min(i + batch_size, total)}/{total} uploaded to {table}")
        time.sleep(0.05)


def main():
    clear_existing_data()
    categories, products, product_images = load_wishhub_products()
    print(f"Prepared {len(categories)} categories, {len(products)} products, {len(product_images)} product images.")

    upload_batches("categories", categories, batch_size=50)
    upload_batches("products", products, batch_size=100)
    upload_batches("product_images", product_images, batch_size=200)

    print("All WishHub products, images, and categories successfully uploaded to Supabase!")


if __name__ == "__main__":
    main()
