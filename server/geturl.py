import re
import requests
import sys
import urllib

query = sys.argv[1]

# pattern = re.compile('''id''')
# print pattern
url = "https://www.youtube.com/results?search_query=" + urllib.quote_plus(query)
# print url

r = requests.get(url)
# print str(r)
# print r.encoding
text = r.text.encode('utf-8')
# print text

# m = pattern.match(text)
m = re.search(r'''data-context-item-id="(.{11})"''', text, re.M|re.I)
# print m
if m is None:
	print "0000000"
else:
	print "{}".format(m.group(1))
