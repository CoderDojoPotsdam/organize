#!/usr/bin/python3
try:
    import sys
    import os.path
    import hashlib
    import time
    
    if sys.version_info[0] != 3:
        print("require Python 3 but got", sys.version)
        input()

    if len(sys.argv) < 2:
        file = input('filename:')
    else:
        file = sys.argv[1]
    Subject = name = os.path.splitext(os.path.basename(file))[0]

    s = open(file, encoding = "UTF-8").read()

    h = hashlib.sha1(name.lower().encode('utf-8'))
    mail_identifier = h.hexdigest()
    domain = os.path.basename(__file__)

    output = os.path.join(os.path.dirname(file), name + '.eml')

    print(" mail ".center(10).center(50, '-'))
    for line in s.splitlines():
        if '@' in line:
            print(line)
    print("")
    print(" namen ".center(10).center(50, '-'))
    n = ""
    last_line = ''
    for line in s.splitlines():
        if not last_line and not "@" in line:
            n += line + '\n'
        elif not last_line and "@" in line:
            print("error: ", line)
        elif line:
            if '<' in line:
                add = line[:line.find('<')].strip()
            else:
                add = line
            n += '  - ' + add + '\n'
        last_line = line

    print(n)

    import re
    import base64

    with open(output, 'wb') as f:
        To = b"To:"
        for line in s.splitlines():
            if '@' in line:
                name, mail = re.match('\s*([^<]+)<([^>]+)>', line).groups()
                if name.encode("UTF-8") != name or '@' in name:
                    name = b"=?UTF-8?B?" + base64.b64encode(name.encode('UTF-8')) + b"?="
                else:
                    name = name.encode('ASCII')
                To += b' ' + name + b" <" + mail.encode('ASCII') + b">,\r\n"
        assert To[-3:] == b",\r\n"
        To = To[:-3] + b"\r\n"
        Content = n
        
        f.write(To)
        f.write(("Subject: " + Subject).encode("UTF-8") + b'\r\n')
        # reference the original email to enable a tree view
        f.write("In-Reply-To: <{identifier}@{domain}>\r\n"\
                "References: <{identifier}@{domain}>\r\n"\
                "Message-ID: <{identifier}1@{domain}>\r\n".format(identifier = mail_identifier, domain = domain).encode())
        f.write(b"Content-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n")
        f.write(("Date: " + time.strftime("%a, %d %b %Y %H:%M:%S") + "\r\n").encode('UTF-8'))
        f.write(b"\r\n")
        content = n
        content = content.replace('&', "&amp;").replace("<", "&lt;").replace('>', "&gt;").replace("\n", "<br/>\n").replace("  ", '&nbsp;'*2)
        content = "<html><head></head><body>\n" + content + '\n</body></html>'
        f.write(content.encode('UTF-8'))

except:
    import traceback
    traceback.print_exc()
    input()
