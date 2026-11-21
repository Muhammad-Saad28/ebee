import openpyxl
import json
import re
import os

wb = openpyxl.load_workbook('ebee_products.xlsx', read_only=True)
sheet = wb['Products']
rows = sheet.iter_rows(values_only=True)
headers = next(rows)

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', str(text).lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

categories_map = {}
products = []

for idx, r in enumerate(rows):
    name = r[1]
    if not name:
        continue
    sku = str(r[2] or f'EB-{idx+1}').strip()
    cat_raw = str(r[3] or 'Everyday Essentials').strip()
    
    cat_parts = [p.strip() for p in cat_raw.split('>')]
    main_cat = cat_parts[0]
    sub_cat = cat_parts[1] if len(cat_parts) > 1 else None
    
    main_cat_slug = slugify(main_cat)
    if main_cat not in categories_map:
        categories_map[main_cat] = {
            'id': f'cat-{main_cat_slug}',
            'name': main_cat,
            'slug': main_cat_slug,
            'subcategories': set(),
            'product_count': 0,
            'sample_image': None
        }
    categories_map[main_cat]['product_count'] += 1
    if sub_cat:
        categories_map[main_cat]['subcategories'].add(sub_cat)

    img_raw = str(r[9] or '')
    images = [url.strip().replace('http://', 'https://') for url in re.split(r'[\r\n,]+', img_raw) if url.strip().startswith('http')]
    if not images and r[0] and str(r[0]).startswith('http'):
        images = [str(r[0]).replace('http://', 'https://')]
    
    if images and not categories_map[main_cat]['sample_image']:
        categories_map[main_cat]['sample_image'] = images[0]

    try:
        price = float(r[4]) if r[4] is not None else 999.0
    except:
        price = 999.0

    try:
        old_price = float(r[5]) if r[5] is not None else None
    except:
        old_price = None

    if old_price and old_price <= price:
        old_price = None

    discount = round(((old_price - price) / old_price) * 100) if old_price and old_price > price else 0

    in_stock = True if str(r[6] or '').lower() in ['yes', 'true', '1'] else True
    
    try:
        reviews_count = int(r[7]) if r[7] is not None else 0
    except:
        reviews_count = 0

    desc = str(r[8] or '').strip()

    safe_sku_slug = re.sub(r'[^a-z0-9-]', '', sku.lower())
    slug = f"{slugify(name)[:70]}-{safe_sku_slug}"
    slug = re.sub(r'[^a-z0-9-]', '', slug)

    is_featured = (idx % 12 == 0) or (reviews_count > 0 and idx % 7 == 0)
    is_bestseller = (reviews_count >= 2) or (idx % 17 == 0)
    is_trending = (discount > 20) or (idx % 19 == 0)

    rating = 4.5 if reviews_count > 1 else (4.8 if reviews_count == 1 else 4.2 + (idx % 8) * 0.1)
    rating = round(min(5.0, rating), 1)

    clean_id = f"prod-{safe_sku_slug or idx+1}"

    products.append({
        'id': clean_id,
        'title': name,
        'slug': slug,
        'sku': sku,
        'category': main_cat,
        'category_slug': main_cat_slug,
        'subcategory': sub_cat,
        'price': price,
        'old_price': old_price,
        'discount': discount,
        'in_stock': in_stock,
        'stock_quantity': 30 if in_stock else 0,
        'rating': rating,
        'review_count': max(reviews_count, (idx % 15) + 1),
        'description': desc if desc and len(desc) > 10 else f'Discover the premium {name}. Engineered for exceptional performance, durability, and daily convenience.',
        'images': images if images else ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        'thumbnail': images[0] if images else 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'is_featured': is_featured,
        'is_bestseller': is_bestseller,
        'is_trending': is_trending,
        'created_at': '2026-11-20T12:00:00Z'
    })

final_categories = []
for k, v in categories_map.items():
    v['subcategories'] = sorted(list(v['subcategories']))
    final_categories.append(v)
final_categories.sort(key=lambda x: x['product_count'], reverse=True)

os.makedirs('src/data', exist_ok=True)

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

with open('src/data/categories.json', 'w', encoding='utf-8') as f:
    json.dump(final_categories, f, ensure_ascii=False, indent=2)

print(f'Successfully exported {len(products)} products and {len(final_categories)} categories to src/data/')
