# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts")))
from book_act1 import ACT1_CHAPTERS
from book_act2 import ACT2_CHAPTERS
from book_act3 import ACT3_CHAPTERS
from book_act4 import ACT4_CHAPTERS

all_ch = ACT1_CHAPTERS + ACT2_CHAPTERS + ACT3_CHAPTERS + ACT4_CHAPTERS

print("=== SEMICOLONS (;) ===")
for ch in all_ch:
    for line in ch['content'].split('\n'):
        if ';' in line:
            print(f"[Ch {ch['num']}] {line.strip()}")

print("\n=== COLONS (:) ===")
for ch in all_ch:
    for line in ch['content'].split('\n'):
        if ':' in line:
            print(f"[Ch {ch['num']}] {line.strip()}")
