
module.exports = {
  lang: (lang, word) => {
    const spanish = require("../dictionary/spanish.json");
    const english = require("../dictionary/english.json");

    const dictironary = {
      Esp: spanish,
      Eng: english,
    };

    return dictironary[lang ? lang : "Eng"][word]
      ? dictironary[lang ? lang : "Eng"][word]
      : word;
  }
};

