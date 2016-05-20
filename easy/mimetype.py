import sys
import math

N = int(input())  # Number of elements which make up the association table.
Q = int(input())  # Number Q of file names to be analyzed.

exts = dict()

for i in range(N):
    # EXT: file extension
    # MT: MIME type.
    EXT, MT = input().split()
    exts[EXT.lower()] = MT

for i in range(Q):
    FNAME = input()  # One file name per line.
    FEXT = FNAME.split('.')
    if len(FEXT) < 2:
        print("UNKNOWN");
    else:
        FEXT=FEXT[-1].lower()
        if FEXT in exts: print(exts[FEXT])
        else: print("UNKNOWN")
