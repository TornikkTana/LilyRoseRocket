import urllib.request
import re

url = "https://www.facebook.com/people/LilyRose/61574653990871/"
req = urllib.request.Request(url)
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
req.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8')
req.add_header('Accept-Language', 'en-US,en;q=0.9')

try:
    with urllib.request.urlopen(req, timeout=15) as response:
        html = response.read().decode('utf-8')
        
    print("Fetch successful!")
    # Find all image links or URLs
    img_urls = re.findall(r'https://scontent\.[^\s"\'><]+', html)
    print(f"Found {len(img_urls)} raw scontent image URLs.")
    
    unique_imgs = set()
    for u in img_urls:
        clean = u.replace('&amp;', '&').replace('\\/', '/')
        # Remove trailing characters that are not part of the URL
        clean = clean.split('"')[0].split("'")[0].split('\\')[0]
        if any(kw in clean for kw in ['t39.30808', 'p526x296', 'p180x540', 's720x720', 'rsrc.php']):
            unique_imgs.add(clean)
            
    print(f"Filtered to {len(unique_imgs)} image candidates:")
    for idx, img in enumerate(sorted(unique_imgs)):
        print(f"{idx+1}: {img}")
        
except Exception as e:
    print(f"Error: {e}")
