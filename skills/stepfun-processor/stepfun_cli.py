#!/usr/bin/env python3
"""
StepFun Processor Skill
Generic CLI tool to process text/JSON using StepFun API.
"""
import os
import sys
import json
import argparse
import urllib.request
import urllib.error

def call_stepfun(prompt, model="step-3.5-flash", api_key=None, temperature=0.1):
    if not api_key:
        api_key = os.getenv("STEP_API_KEY")
    
    if not api_key:
        print("Error: STEP_API_KEY not found", file=sys.stderr)
        sys.exit(1)
        
    url = "https://api.stepfun.ai/v1/chat/completions"
    
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a precise data processing assistant. Return only the requested format."},
            {"role": "user", "content": prompt}
        ],
        "temperature": temperature
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(
            url, 
            data=payload, 
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=60) as response:
            data = json.loads(response.read().decode())
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error calling StepFun API: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Process text with StepFun API")
    parser.add_argument("--prompt", help="Prompt to send (or use --prompt-file)")
    parser.add_argument("--prompt-file", help="File containing the prompt")
    parser.add_argument("--input", help="Input data (appended to prompt)")
    parser.add_argument("--input-file", help="File containing input data")
    parser.add_argument("--model", default="step-3.5-flash", help="Model to use")
    parser.add_argument("--json", action="store_true", help="Force JSON output")
    
    args = parser.parse_args()
    
    # Construct prompt
    prompt_text = ""
    if args.prompt_file:
        with open(args.prompt_file, 'r') as f:
            prompt_text = f.read()
    elif args.prompt:
        prompt_text = args.prompt
    
    # Append input
    input_text = ""
    if args.input_file:
        with open(args.input_file, 'r') as f:
            input_text = f.read()
    elif args.input:
        input_text = args.input
    elif not sys.stdin.isatty():
        input_text = sys.stdin.read()
        
    full_prompt = f"{prompt_text}\n\n{input_text}"
    
    if args.json:
        full_prompt += "\n\nReturn ONLY valid JSON."
        
    result = call_stepfun(full_prompt, model=args.model)
    print(result)

if __name__ == "__main__":
    main()
