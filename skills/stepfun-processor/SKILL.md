---
name: stepfun-processor
description: Generic CLI tool for processing text and data using StepFun API (step-3.5-flash). Ideal for cheap, high-volume tasks like parsing, categorization, and extraction.
usage: python3 stepfun_cli.py --prompt "Summarize this" --input-file data.txt
---

# StepFun Processor

A lightweight CLI wrapper for the StepFun API.

## Usage

```bash
# Direct input
python3 stepfun_cli.py --prompt "Convert to JSON" --input "Name: John, Age: 30"

# File input
python3 stepfun_cli.py --prompt-file prompt.txt --input-file data.txt

# Pipe input
cat data.txt | python3 stepfun_cli.py --prompt "Extract emails"
```

## Environment
Requires `STEP_API_KEY` environment variable.
