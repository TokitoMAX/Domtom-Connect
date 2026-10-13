import smtplib, time

def try_connect():
    print("Testing port 587 with STARTTLS...")
    try:
        s = smtplib.SMTP("smtp.gmail.com", 587, timeout=15)
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
        print("Success on 587!")
        s.quit()
        return 587
    except Exception as e:
        print("Error on 587:", e)

    print("Testing port 465 with SSL...")
    try:
        s = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15)
        s.login("domtomconnect@gmail.com", "geqpuqluimxdjxeo")
        print("Success on 465!")
        s.quit()
        return 465
    except Exception as e:
        print("Error on 465:", e)
    return None

res = try_connect()
print("Selected port:", res)
