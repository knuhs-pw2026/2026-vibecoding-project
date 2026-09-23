def test_files():
    # 1. Test index.html
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    assert "PocketPassage" in html
    assert "dict.js" in html
    assert "presets.js" in html
    assert "app.js" in html
    assert "style.css" in html
    assert "popWordMeaningInput" in html
    assert "btnToggleAlwaysShowMeaning" in html
    print("index.html integrity: PASS")

    # 2. Test dict.js
    with open("dict.js", "r", encoding="utf-8") as f:
        dict_content = f.read()
    assert "BUILTIN_DICT" in dict_content
    assert "findDictEntry" in dict_content
    assert "human" in dict_content
    assert "brain" in dict_content
    assert "cognitive" in dict_content
    assert "fetchOnlineTranslation" in dict_content
    print("dict.js integrity: PASS")

    # 3. Test presets.js
    with open("presets.js", "r", encoding="utf-8") as f:
        presets = f.read()
    assert "PRESET_PASSAGES" in presets
    assert "findDictEntry" in presets
    print("presets.js integrity: PASS")

    # 4. Test app.js
    with open("app.js", "r", encoding="utf-8") as f:
        app = f.read()
    assert "findDictEntry" in app
    assert "sanitizeVocabulary" in app
    assert "openWordModal" in app
    assert "popWordMeaningInput" in app
    assert "alwaysShowMeaning" in app
    print("app.js integrity: PASS")

    print("\n[SUCCESS] All files and dictionary integration verified successfully!")

if __name__ == "__main__":
    test_files()
