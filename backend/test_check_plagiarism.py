import requests

URL = "http://127.0.0.1:8000/api/check-plagiarism"

files = [
    ("file", open("/tmp/sample1.txt", "rb")),
    ("file", open("/tmp/sample2.txt", "rb")),
]

for f in files:
    print(f"Uploading: {f[1].name}")
    try:
        r = requests.post(URL, files={"file": f[1]})
        print(r.status_code)
        print(r.json())
    except Exception as e:
        print("Request failed:", e)
    finally:
        f[1].close()
