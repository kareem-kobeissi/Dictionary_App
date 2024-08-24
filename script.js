document.getElementById('search-btn').addEventListener('click', function() {
    const input = document.getElementById('search').value.trim();
    
    if (input) {
        // Check if the input is a phrase (contains spaces)
        const isPhrase = input.split(' ').length > 1;

        if (isPhrase) {
            document.getElementById('result').innerHTML = `<p>Please enter a single word instead of a phrase. 🤔</p>`;
        } else {
            // Fetch English definition
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('result');
                if (data.title) {
                    resultDiv.innerHTML = `<p>Sorry, we couldn't find the word "<strong>${input}</strong>". Please try another word or check the spelling. 🤔</p>`;
                } else {
                    const definition = data[0].meanings[0].definitions[0].definition;

                    // Fetch Arabic translation
                    fetch(`https://api.mymemory.translated.net/get?q=${input}&langpair=en|ar`)
                    .then(translationResponseAr => translationResponseAr.json())
                    .then(translationDataAr => {
                        const arabicTranslation = translationDataAr.responseData.translatedText;

                        // Fetch Spanish translation
                        fetch(`https://api.mymemory.translated.net/get?q=${input}&langpair=en|es`)
                        .then(translationResponseEs => translationResponseEs.json())
                        .then(translationDataEs => {
                            const spanishTranslation = translationDataEs.responseData.translatedText;

                            // Display the English definition, Arabic, and Spanish translations
                            resultDiv.innerHTML = `
                                <h2>${data[0].word}</h2>
                                <p><strong>Definition:</strong> ${definition}</p>
                                <p><strong>Arabic Translation:</strong> ${arabicTranslation}</p>
                                <p><strong>Spanish Translation:</strong> ${spanishTranslation}</p>
                            `;
                        })
                        .catch(() => {
                            resultDiv.innerHTML = `<p>Sorry, we couldn't retrieve the Spanish translation. 😔</p>`;
                        });
                    })
                    .catch(() => {
                        resultDiv.innerHTML = `<p>Sorry, we couldn't retrieve the Arabic translation. 😔</p>`;
                    });
                }
            })
            .catch(() => {
                document.getElementById('result').innerHTML = '<p>Sorry, something went wrong. Please try again later. 😔</p>';
            });
        }
    } else {
        document.getElementById('result').innerHTML = '<p>Please enter a word to search. 🤔</p>';
    }
});
