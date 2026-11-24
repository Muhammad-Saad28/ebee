"""
wishhub.pk full-site scraper -> Excel (with embedded product images)

SETUP:
    pip install requests beautifulsoup4 openpyxl pillow

RUN:
    python wishhub_scraper.py            # full site
    python wishhub_scraper.py --test     # quick test with 15 products

OUTPUT:
    wishhub_products.xlsx                (all products, images embedded)
    cache_wishhub/products.json          (saved progress - re-running resumes)
    cache_wishhub/product_urls.json      (cached product URLs)
    cache_wishhub/cat_map.json           (category mapping)
    cache_wishhub/images/                (downloaded images)
"""
import io, json, os, re, sys, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urljoin
import xml.etree.ElementTree as ET

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from bs4 import BeautifulSoup
from PIL import Image as PILImage
from openpyxl import Workbook
from openpyxl.drawing.image import Image as XLImage
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

BASE = "https://www.wishhub.pk"
SITEMAP_URL = f"{BASE}/sitemap.xml"

CACHE = "cache_wishhub"
IMG_DIR = os.path.join(CACHE, "images")
PRODUCTS_JSON = os.path.join(CACHE, "products.json")
URLS_JSON = os.path.join(CACHE, "product_urls.json")
CAT_MAP_JSON = os.path.join(CACHE, "cat_map.json")
OUT_XLSX = "wishhub_products.xlsx"
TEST = "--test" in sys.argv

os.makedirs(IMG_DIR, exist_ok=True)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
}
session = requests.Session()
retries = Retry(total=5, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504])
adapter = HTTPAdapter(pool_connections=25, pool_maxsize=25, max_retries=retries)
session.mount("https://", adapter)
session.mount("http://", adapter)
session.headers.update(HEADERS)


# ---------------------------------------------------------------- step 1: discover URLs & categories
def fetch_sitemap_urls():
    if os.path.exists(URLS_JSON) and os.path.exists(CAT_MAP_JSON):
        urls = json.load(open(URLS_JSON))
        cat_map = json.load(open(CAT_MAP_JSON))
        print(f"Loaded {len(urls)} product URLs and category map from cache.")
        return urls, cat_map

    print("Fetching sitemap from wishhub.pk ...")
    r = session.get(SITEMAP_URL, timeout=30)
    root = ET.fromstring(r.content)
    all_locs = [elem.text for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if elem.text]

    product_urls = [u for u in all_locs if u.endswith(".html") and not any(x in u for x in ["login", "register", "cart", "checkout", "wishlist"])]
    cat_urls = [u for u in all_locs if not u.endswith(".html") and u not in [
        f"{BASE}/", f"{BASE}/login", f"{BASE}/register", f"{BASE}/about-us", f"{BASE}/contact-us", f"{BASE}/all-products"
    ]]

    print(f"Discovered {len(product_urls)} products and {len(cat_urls)} category pages in sitemap.")

    # Build category map by scraping category listing links in parallel
    cat_map = {}
    print(f"Mapping products to categories ({len(cat_urls)} categories) ...")

    def map_category(cat_url):
        results = []
        try:
            rc = session.get(cat_url, timeout=15)
            if rc.status_code == 200:
                sc = BeautifulSoup(rc.text, "html.parser")
                cat_path = cat_url.replace(BASE, "").strip("/").split("/")
                cat_label = " > ".join([p.replace("-", " ").title() for p in cat_path])
                for a in sc.find_all("a", href=True):
                    h = a["href"].split("?")[0].split("#")[0]
                    if h.endswith(".html") and not any(x in h for x in ["login", "register", "cart", "checkout", "wishlist"]):
                        h_full = urljoin(BASE, h)
                        results.append((h_full, cat_label))
        except Exception:
            pass
        return results

    with ThreadPoolExecutor(max_workers=10) as ex:
        for res_list in ex.map(map_category, cat_urls):
            for p_url, c_label in res_list:
                cat_map.setdefault(p_url, c_label)

    json.dump(product_urls, open(URLS_JSON, "w"), indent=1)
    json.dump(cat_map, open(CAT_MAP_JSON, "w"), indent=1)
    print(f"Category mapping complete: {len(cat_map)} products mapped to categories.")
    return product_urls, cat_map


# ---------------------------------------------------------------- step 2: product page parser
def money(s):
    if not s:
        return None
    try:
        return float(str(s).replace(",", "").strip())
    except ValueError:
        return None


def parse_product(args):
    url, category_fallback = args
    r = None
    last_err = None
    for attempt in range(4):
        try:
            r = session.get(url, timeout=25)
            if r.status_code == 200:
                break
        except Exception as e:
            last_err = str(e)
        time.sleep(1.0 * (attempt + 1))

    if r is None or r.status_code != 200:
        err_msg = f"HTTP {getattr(r, 'status_code', 'fail')}"
        if last_err and not getattr(r, 'status_code', None):
            err_msg += f" ({last_err[:50]})"
        return {"url": url, "error": err_msg}

    html = r.text
    soup = BeautifulSoup(html, "html.parser")
    d = {"url": url}

    # Check JSON-LD
    schema = {}
    for s in soup.find_all("script", type="application/ld+json"):
        if s.string:
            try:
                parsed = json.loads(s.string)
                if isinstance(parsed, dict) and parsed.get("@type") == "Product":
                    schema = parsed
                    break
            except Exception:
                pass

    # Name
    name = schema.get("name")
    if not name:
        name_el = soup.select_one(".product-infor-name")
        if name_el:
            # clone / decompose badges
            name_copy = BeautifulSoup(str(name_el), "html.parser")
            for b in name_copy.select(".badge-stock"):
                b.decompose()
            name = name_copy.get_text(" ", strip=True)
        elif soup.title:
            name = soup.title.string.strip()
    d["name"] = name.strip() if name else ""

    # SKU
    sku = schema.get("sku")
    if not sku:
        sku_el = soup.select_one(".meta_prd_code")
        if sku_el:
            sku = sku_el.get_text(" ", strip=True).replace("SKU:", "").strip()
        else:
            m = re.search(r"SKU\s*[:#]?\s*([A-Za-z0-9\- ]+)", html)
            sku = m.group(1).strip() if m else ""
    d["sku"] = sku.strip() if sku else ""

    # Price & Old Price
    # Look at .product-infor-price
    cur_p = None
    old_p = None

    price_on_sale = soup.select_one(".price-on-sale")
    if price_on_sale:
        m = re.search(r"([\d,]+(?:\.\d+)?)", price_on_sale.get_text(" ", strip=True))
        if m:
            cur_p = money(m.group(1))

    old_p_el = soup.select_one(".product-infor-price .text-decoration-line-through")
    if old_p_el:
        m = re.search(r"([\d,]+(?:\.\d+)?)", old_p_el.get_text(" ", strip=True))
        if m:
            old_p = money(m.group(1))

    # fallback to schema price
    if cur_p is None:
        cur_p = money(schema.get("offers", {}).get("price"))

    d["price"] = cur_p
    d["old_price"] = old_p

    # Stock
    stock_el = soup.select_one(".badge-stock")
    if stock_el:
        d["in_stock"] = stock_el.get_text(" ", strip=True)
    elif "InStock" in str(schema.get("offers", {}).get("availability", "")):
        d["in_stock"] = "In Stock"
    elif "OutOfStock" in str(schema.get("offers", {}).get("availability", "")):
        d["in_stock"] = "Out of Stock"
    else:
        d["in_stock"] = "In Stock"

    # Reviews
    rev_el = soup.select_one(".meta_rate")
    rev_text = rev_el.get_text(" ", strip=True) if rev_el else ""
    m = re.search(r"(\d+)\s+reviews?", rev_text, re.I)
    d["reviews"] = int(m.group(1)) if m else 0

    # Category
    d["category"] = category_fallback or ""

    # Description
    desc = ""
    desc_el = soup.select_one("#description, .tab-pane#description")
    if desc_el:
        desc = desc_el.get_text("\n", strip=True)
    if not desc:
        desc = schema.get("description", "")
    if not desc:
        md = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", property="og:description")
        desc = md["content"].strip() if md and md.get("content") else ""
    d["description"] = desc

    # Images
    imgs = []
    # Note: schema.org image points to /mobile/ which 404s/redirects to HTML on wishhub, so prefer DOM theme images
    og = soup.find("meta", property="og:image")
    if og and og.get("content") and "/theme/image" in og["content"]:
        imgs.append(og["content"])

    for im in soup.find_all("img"):
        for attr in ("data-zoom-image", "data-large", "data-src", "data-original", "src"):
            src = im.get(attr)
            if src:
                imgs.append(src)
                break

    clean = []
    for s in imgs:
        s = urljoin(BASE, s)
        sl = s.lower()
        if "/mobile/" in sl:
            continue
        if any(x in sl for x in ["placeholder", "logo", "banner", "icon", "loader", "sprite", ".gif", ".svg", "verify"]):
            continue
        if "/product" not in sl and "upload" not in sl and "/image" not in sl:
            continue
        if s not in clean:
            clean.append(s)

    d["images"] = clean
    return d


# ---------------------------------------------------------------- step 3: scrape products
def scrape_products(urls, cat_map):
    data = json.load(open(PRODUCTS_JSON)) if os.path.exists(PRODUCTS_JSON) else {}
    todo = [u for u in urls if u not in data or data[u].get("error")]
    if TEST:
        todo = todo[:15]
    print(f"{len(data)} already done, {len(todo)} to fetch")

    work_items = [(u, cat_map.get(u, "")) for u in todo]
    done = 0
    with ThreadPoolExecutor(max_workers=5) as ex:
        for res in ex.map(parse_product, work_items):
            data[res["url"]] = res
            done += 1
            if done % 25 == 0:
                json.dump(data, open(PRODUCTS_JSON, "w"))
                print(f"  {done}/{len(todo)}")
            time.sleep(0.1)
    json.dump(data, open(PRODUCTS_JSON, "w"))
    return data


# ---------------------------------------------------------------- step 4: download images
def download_image(item):
    for src in item.get("images", []):
        fn = re.sub(r"[^A-Za-z0-9]+", "_", item["url"].rstrip("/").split("/")[-1])[:80] + ".png"
        path = os.path.join(IMG_DIR, fn)
        if os.path.exists(path):
            return path
        try:
            r = session.get(src, timeout=30)
            if r.status_code == 200 and "image" in r.headers.get("content-type", ""):
                img = PILImage.open(io.BytesIO(r.content)).convert("RGB")
                img.thumbnail((140, 140))
                img.save(path, "PNG")
                return path
        except Exception:
            continue
    return None


# ---------------------------------------------------------------- step 5: build Excel
def build_excel(data):
    items = [v for v in data.values() if not v.get("error")]
    errors = [v for v in data.values() if v.get("error")]
    print(f"Downloading images for {len(items)} products ...")
    with ThreadPoolExecutor(max_workers=8) as ex:
        paths = list(ex.map(download_image, items))

    wb = Workbook()
    ws = wb.active
    ws.title = "Products"

    headers = [
        "Image", "Name", "SKU", "Category", "Price (PKR)", "Old Price (PKR)",
        "In Stock", "Reviews", "Description", "Image URLs", "Product URL",
    ]
    ws.append(headers)

    header_fill = PatternFill("solid", fgColor="1F497D")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    for col in range(1, len(headers) + 1):
        c = ws.cell(row=1, column=col)
        c.fill = header_fill
        c.font = header_font
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 28

    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    align_desc = Alignment(horizontal="left", vertical="top", wrap_text=True)
    font_link = Font(name="Calibri", size=10, color="0563C1", underline="single")
    font_body = Font(name="Calibri", size=10)

    for i, (item, img_path) in enumerate(zip(items, paths), start=2):
        ws.row_dimensions[i].height = 100
        desc = (item.get("description") or "")[:4000]
        all_imgs = "\n".join(item.get("images") or [])

        row = [
            "",  # image placeholder
            item.get("name") or "",
            item.get("sku") or "",
            item.get("category") or "",
            item.get("price"),
            item.get("old_price"),
            item.get("in_stock") or "",
            item.get("reviews"),
            desc,
            all_imgs,
            item.get("url") or "",
        ]
        ws.append(row)

        for col in range(1, len(headers) + 1):
            cell = ws.cell(row=i, column=col)
            cell.font = font_body
            if col in [1, 3, 5, 6, 7, 8]:
                cell.alignment = align_center
            elif col in [9, 10]:
                cell.alignment = align_desc
            else:
                cell.alignment = align_left

        # format prices
        if item.get("price") is not None:
            ws.cell(row=i, column=5).number_format = "#,##0"
        if item.get("old_price") is not None:
            ws.cell(row=i, column=6).number_format = "#,##0"

        # clickable URL
        u_cell = ws.cell(row=i, column=11)
        u_cell.hyperlink = item.get("url")
        u_cell.font = font_link

        # embed image
        if img_path and os.path.exists(img_path):
            try:
                ximg = XLImage(img_path)
                ximg.width, ximg.height = 120, 120
                ws.add_image(ximg, f"A{i}")
            except Exception:
                pass

    # auto column widths
    widths = {
        "A": 18, "B": 42, "C": 16, "D": 32, "E": 14, "F": 15,
        "G": 12, "H": 10, "I": 55, "J": 30, "K": 35,
    }
    for col_letter, w in widths.items():
        ws.column_dimensions[col_letter].width = w

    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{len(items) + 1}"

    # Failed pages sheet
    if errors:
        ws_err = wb.create_sheet(title="Failed pages")
        ws_err.append(["URL", "Error"])
        for col in [1, 2]:
            c = ws_err.cell(row=1, column=col)
            c.fill = header_fill
            c.font = header_font
        for e in errors:
            ws_err.append([e.get("url"), e.get("error")])
        ws_err.column_dimensions["A"].width = 80
        ws_err.column_dimensions["B"].width = 30

    wb.save(OUT_XLSX)
    print(f"Saved {OUT_XLSX}: {len(items)} products, {len(errors)} failed")


def main():
    urls, cat_map = fetch_sitemap_urls()
    data = scrape_products(urls, cat_map)
    build_excel(data)


if __name__ == "__main__":
    main()
