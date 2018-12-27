from threading import Timer

def hello():
    print("hello, world")

t = Timer(3, hello)
t.start()
