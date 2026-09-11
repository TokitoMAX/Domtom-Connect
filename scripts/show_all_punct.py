# -*- coding: utf-8 -*-
import os, sys, re

def inspect():
    for act_idx in [1, 2, 3, 4]:
        fname = f"scripts/book_act{act_idx}.py"
        with open(fname, "r", encoding="utf-8") as f:
            lines = f.readlines()
        print(f"\n==================== ACTE {act_idx} ====================")
        for line_num, line in enumerate(lines, 1):
            stripped = line.strip()
            # ignore python headers and dict keys
            if stripped.startswith('"num"') or stripped.startswith('"title"') or stripped.startswith('"act"') or stripped.startswith('#') or stripped.startswith('"""') or stripped.startswith('ACT'):
                continue
            if ';' in stripped:
                print(f"[Line {line_num}] SEMICOLON: {stripped}")
            elif ':' in stripped:
                print(f"[Line {line_num}] COLON: {stripped}")

if __name__ == "__main__":
    inspect()
