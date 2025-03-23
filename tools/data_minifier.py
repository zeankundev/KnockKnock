def minify_string(multiline_string):
    lines = multiline_string.splitlines()
    minified = '\\n'.join(lines)
    return minified

if __name__ == "__main__":
    example = """
training data here
    """

    result = minify_string(example)
    print("Original string:")
    print(repr(example))
    print("\nMinified string:")
    print(result)
    print("\nConverting back to multiline (for verification):")
    original_format = result.replace('\\n', '\n')
    print(repr(original_format))