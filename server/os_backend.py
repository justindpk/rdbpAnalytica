import requests
def extract_source(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0'}
    source=requests.get(url, headers=headers).text
    return source
print(extract_source("https://opensea.io/assets/ethereum/0x7a4d1b54dd21dde804c18b7a830b5bc6e586a7f6/1"))