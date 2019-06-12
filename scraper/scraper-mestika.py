import csv
from bs4 import BeautifulSoup
import requests
import html5lib

with open('data-mestika-update.csv', "w") as f:
    writer = csv.writer(f)
    writer.writerow(["Puesto", "Ciudad", "Fecha"])

    for page in range(0, 640):


        url = "https://www.domestika.org/es/jobs/date/forever?page={}".format(page)
        r = requests.get(url)

        data = r.text

        soup = BeautifulSoup(data, 'html5lib')

        items = soup.select("li[class$=job-item]")


        for elem in items:
            job = elem.find('a', {'class': "job-title"}).text
            city = elem.find('div', {'class': 'job-item__city'}).string.partition(',')[0].strip()
            date = elem.find('div', {'class': 'job-item__date'}).text
            writer.writerow([job, city, date])
