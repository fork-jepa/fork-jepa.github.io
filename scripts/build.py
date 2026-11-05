from pathlib import Path
from html.parser import HTMLParser
import shutil
root = Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img':
            assert a.get('alt'), 'Image missing alt text'
        for key in ('href', 'src'):
            v = a.get(key, '')
            if v and not v.startswith(('https:', 'http:', '#', 'data:')):
                assert (root / v).is_file(), f'Missing resource: {v}'
html = (root / 'index.html').read_text()
Check().feed(html)
assert html.count('Coming soon') == 3
assert 'Anonymous' in html
assert 'CONFIDENTIAL' not in html and 'TBD' not in html
assert not list(root.glob('**/*.pdf')), 'PDF must not be packaged'
out = root / 'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
shutil.copy2(root / 'index.html', out / 'index.html')
shutil.copytree(root / 'static', out / 'static')
print('Build passed: all local resources exist; static site written to dist/')
