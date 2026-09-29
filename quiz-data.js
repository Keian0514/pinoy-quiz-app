"use strict";

function buildQuestions(rows, includeImages = false) {
    const facts = rows.trim().split("\n").map((row) => {
        const [question, answer, image] = row.split("|");
        return { question, answer, image };
    });
    const uniqueAnswers = [...new Set(facts.map((fact) => fact.answer))];

    return facts.map((fact, index) => {
        const alternatives = uniqueAnswers.filter((answer) => answer !== fact.answer);
        const distractors = Array.from({ length: 3 }, (_, offset) =>
            alternatives[(index + offset) % alternatives.length]
        );
        const answerIndex = (index * 3 + 1) % 4;
        const options = [...distractors];
        options.splice(answerIndex, 0, fact.answer);

        return {
            question: fact.question,
            options,
            answer: answerIndex,
            ...(includeImages ? { image: fact.image } : {})
        };
    });
}

const quizData = {
    HISTORY: {
        Easy: buildQuestions(`
What is the capital of the Philippines?|Manila
Who is known as the national hero of the Philippines?|Jose Rizal
On what date is Philippine Independence Day celebrated?|June 12
Who founded the Katipunan?|Andres Bonifacio
Who was the first president of the Philippines?|Emilio Aguinaldo
Who wrote Noli Me Tangere?|Jose Rizal
In what year was Philippine independence proclaimed?|1898
Who is called the Sublime Paralytic?|Apolinario Mabini
Where was the First Philippine Republic inaugurated?|Malolos
What is the national language of the Philippines?|Filipino`),
        Medium: buildQuestions(`
Who wrote the Kartilya ng Katipunan?|Emilio Jacinto
Which treaty ceded the Philippines from Spain to the United States?|Treaty of Paris
Who was the first president of the Commonwealth?|Manuel L. Quezon
Who was the first woman president of the Philippines?|Corazon Aquino
In what year was the present Constitution ratified?|1987
Who composed the music of Lupang Hinirang?|Julian Felipe
When did the Philippine-American War begin?|1899
Who was the first Filipino to lead the Katipunan?|Andres Bonifacio
Where was Jose Rizal executed?|Bagumbayan
Who wrote El Filibusterismo?|Jose Rizal`),
        Hard: buildQuestions(`
What was the title of Emilio Jacinto in the Katipunan?|Utak ng Katipunan
What was the revolutionary government established in 1897 called?|Biak-na-Bato Republic
Which 1935 document established the Commonwealth government?|Tydings-McDuffie Act
Who served as president of the Second Philippine Republic?|Jose P. Laurel
What was the first Philippine daily newspaper called?|La Solidaridad
Which province was the site of the Cry of Pugad Lawin?|Manila
Who was the first Filipino chief justice of the Supreme Court?|Cayetano Arellano
Which reformist organization was founded in 1892?|La Liga Filipina
Who led the longest revolt against Spanish rule?|Francisco Dagohoy
Which act promised eventual Philippine independence from the United States?|Jones Law`)
    },
    GEOGRAPHY: {
        Easy: buildQuestions(`
What is the largest island in the Philippines?|Luzon
What is the highest mountain in the Philippines?|Mount Apo
Which sea lies west of the Philippines?|West Philippine Sea
What is the capital of Cebu province?|Cebu City
Which volcano is famous for its near-perfect cone?|Mayon Volcano
In which province are the Banaue Rice Terraces?|Ifugao
What is the capital of Palawan?|Puerto Princesa
Which island is known for Chocolate Hills?|Bohol
Which city is nicknamed the Summer Capital of the Philippines?|Baguio
How many major island groups are in the Philippines?|Three`),
        Medium: buildQuestions(`
What is the largest lake in the Philippines?|Laguna de Bay
Which strait separates Samar and Leyte?|San Juanico Strait
What is the southernmost major island group?|Mindanao
Which province is home to Mount Pinatubo?|Zambales
What is the longest river in the Philippines?|Cagayan River
Which island province is famous for the Underground River?|Palawan
Which gulf borders Davao City?|Davao Gulf
What is the capital of Batanes?|Basco
Which lake lies inside a volcano on Luzon?|Taal Lake
Which mountain range runs along western Luzon?|Zambales Mountains`),
        Hard: buildQuestions(`
Which channel separates Mindoro and Palawan?|Mindoro Strait
What is the deepest lake in the Philippines?|Lake Mainit
Which mountain range forms much of eastern Luzon?|Sierra Madre
Which river flows through Metro Manila?|Pasig River
Which island group includes Siargao?|Mindanao
What is the highest peak in the Visayas?|Mount Kanlaon
Which province contains the Kalayaan Island Group municipality?|Palawan
Which strait connects the Sulu Sea and Celebes Sea?|Basilan Strait
What is the largest island in the Sulu Archipelago?|Jolo
Which bay is the site of the historic 1898 naval battle?|Manila Bay`)
    },
    "MUSIC/ARTS": {
        Easy: buildQuestions(`
Who composed the music of the Philippine national anthem?|Julian Felipe
What is a traditional Filipino love song called?|Kundiman
Which instrument is a set of small gongs laid horizontally?|Kulintang
Who painted the Spoliarium?|Juan Luna
What is the Filipino bamboo nose flute called?|Tongali
Which dance uses bamboo poles that dancers step between?|Tinikling
What art form uses folded and cut paper?|Paper cutting
What is a Filipino folk song called?|Kundiman
Who painted the Blood Compact?|Juan Luna
Which instrument has bamboo tubes struck with sticks?|Angklung`),
        Medium: buildQuestions(`
Who was the first National Artist for Visual Arts?|Fernando Amorsolo
Which Filipino composer wrote Anak Dalita?|Francisco Santiago
Who sculpted the Bonifacio Monument in Caloocan?|Guillermo Tolentino
What is the traditional theater form featuring song and dance?|Sarswela
Which dance is traditionally performed with fans?|Cariñosa
Who composed the opera Noli Me Tangere?|Felipe Padilla de Leon
What is the Filipino term for a poet laureate?|Makata ng bayan
Which artist painted the famous Bayanihan mural?|Carlos Francisco
What is a rondalla ensemble centered around?|Plucked string instruments
Which dance is associated with the Maranao people?|Singkil`),
        Hard: buildQuestions(`
Who composed the ballet music for Noli Me Tangere?|Lucresia Kasilag
Which National Artist created the floating installation Bulul?|Napoleon Abueva
Who wrote the novel Banaag at Sikat?|Lope K. Santos
Which Filipino painter is known for transparent cubism?|Vicente Manansala
What is the traditional Maranao epic called?|Darangen
Who composed the opera La Loba Negra?|Francisco Feliciano
Which art movement is Fernando Amorsolo associated with?|Romantic realism
Who is known as the Father of Philippine Modern Sculpture?|Napoleon Abueva
What is the Ilocano epic about Lam-ang called?|Biag ni Lam-ang
Which National Artist wrote the novel Mga Ibong Mandaragit?|Amado V. Hernandez`)
    },
    "SOCIAL CULTURE": {
        Easy: buildQuestions(`
What is a traditional Filipino community celebration called?|Fiesta
What word describes respect for elders in Filipino culture?|Paggalang
What is the Filipino term for helping one another as a community?|Bayanihan
Which greeting is commonly used when asking an elder's hand blessing?|Mano po
What is the Filipino word for family?|Pamilya
What is the national language of the Philippines?|Filipino
What is a Filipino neighborhood commonly called?|Barangay
What is a traditional Filipino word for a spirit or ancestral presence?|Anito
What is the Filipino term for a close friend?|Kaibigan
What do Filipinos commonly call their grandparents?|Lolo and lola`),
        Medium: buildQuestions(`
Which festival honors the Santo Niño in Cebu City?|Sinulog
Which festival is known as the Ati-Atihan of Kalibo?|Ati-Atihan
What is the Filipino term for a communal rice harvest gathering?|Bayanihan
Which celebration in Marinduque features masked performers?|Moriones Festival
What is the traditional Filipino courtship serenade called?|Harana
Which language is widely spoken in the Ilocos region?|Ilocano
Which festival in Bacolod is known for smiling masks?|MassKara Festival
What is the traditional Filipino coming-of-age debut held for?|A young woman's eighteenth birthday
What is a Filipino folk belief in nature spirits called?|Animism
Which festival in Panay features street dancing and costumes?|Dinagyang`),
        Hard: buildQuestions(`
What is the customary Filipino practice of reciprocal obligation called?|Utang na loob
Which term describes shared identity and social solidarity?|Kapwa
What is the customary Filipino matchmaking practice called?|Pamanhikan
Which Maranao textile is known for geometric patterns?|Malong
What is the traditional Filipino wake gathering called?|Lamay
Which indigenous group is associated with the Hudhud chants?|Ifugao
What is the ritual of asking a bride's family for permission called?|Pamanhikan
Which term means an informal Filipino neighborhood settlement?|Pook
What is the traditional Tagalog term for a folk healer?|Albularyo
Which cultural value emphasizes smooth interpersonal relations?|Pakikisama`)
    },
    FOOD: {
        Easy: buildQuestions(`
What is the main souring ingredient in sinigang?|Tamarind
What is the key sauce pairing in classic adobo?|Vinegar and soy sauce
What rice cake is wrapped in banana leaves and steamed?|Suman
What is the shaved-ice dessert with colorful toppings called?|Halo-halo
Which noodle dish is often served at Filipino birthdays?|Pancit
What fruit is commonly used to make dried mangoes in Cebu?|Mango
What is the Filipino spring roll called?|Lumpia
What is the sweet purple yam called?|Ube
Which grilled meat dish is often served on skewers?|Inihaw
What is the Filipino word for rice?|Kanin`),
        Medium: buildQuestions(`
What is the crispy pork knuckle dish called?|Crispy pata
Which stew is traditionally cooked in a clay pot with peanuts?|Kare-kare
What is the Filipino version of a savory eggplant omelet?|Tortang talong
Which vinegar-braised dish is associated with Bicol?|Bicol Express
What is the sweet coconut rice cake called?|Bibingka
Which soup is made with beef shank and bone marrow?|Bulalo
What is the fermented shrimp paste often served with green mango?|Bagoong
Which noodle soup is associated with La Paz in Iloilo?|La Paz batchoy
What is the Filipino caramel custard called?|Leche flan
Which rice cake is topped with coconut and cheese?|Puto`),
        Hard: buildQuestions(`
What is the Kapampangan fermented rice and fish dish called?|Burong isda
Which Bicolano dish is cooked with coconut milk and taro leaves?|Laing
What is the Ilocano bitter melon stew called?|Pinakbet
Which Filipino sausage is traditionally garlicky and cured?|Longganisa
What is the Mindanao spiced rice dish often cooked in coconut milk?|Pastil
Which dish uses pork cooked in blood and vinegar?|Dinuguan
What is the Cebuano roasted whole pig called?|Lechon
Which Pangasinan fermented fish sauce is called?|Bagoong
Which coconut-rich Bicol dish features shredded taro leaves?|Laing
What purple rice cake is traditionally sold during Christmas season?|Puto bumbong`)
    },
    "LOGO QUIZ": {
        Easy: buildQuestions(`
Which brand logo is shown?|Instagram|https://cdn.simpleicons.org/instagram
Which brand logo is shown?|TikTok|https://cdn.simpleicons.org/tiktok
Which brand logo is shown?|McDonald's|https://cdn.simpleicons.org/mcdonalds
Which brand logo is shown?|Nike|https://cdn.simpleicons.org/nike
Which brand logo is shown?|Coca-Cola|https://cdn.simpleicons.org/cocacola
Which brand logo is shown?|Starbucks|https://cdn.simpleicons.org/starbucks
Which brand logo is shown?|Apple|https://cdn.simpleicons.org/apple
Which brand logo is shown?|Google|https://cdn.simpleicons.org/google
Which brand logo is shown?|YouTube|https://cdn.simpleicons.org/youtube
Which brand logo is shown?|Facebook|https://cdn.simpleicons.org/facebook`, true),
        Medium: buildQuestions(`
Which brand logo is shown?|Grab|https://cdn.simpleicons.org/grab
Which brand logo is shown?|Shopee|https://cdn.simpleicons.org/shopee
Which brand logo is shown?|Pinterest|https://cdn.simpleicons.org/pinterest
Which brand logo is shown?|Foodpanda|https://cdn.simpleicons.org/foodpanda
Which brand logo is shown?|Reddit|https://cdn.simpleicons.org/reddit
Which brand logo is shown?|KFC|https://cdn.simpleicons.org/kfc
Which brand logo is shown?|Adidas|https://cdn.simpleicons.org/adidas
Which brand logo is shown?|Netflix|https://cdn.simpleicons.org/netflix
Which brand logo is shown?|Samsung|https://cdn.simpleicons.org/samsung
Which brand logo is shown?|Spotify|https://cdn.simpleicons.org/spotify`, true),
        Hard: buildQuestions(`
Which brand logo is shown?|WhatsApp|https://cdn.simpleicons.org/whatsapp
Which brand logo is shown?|Smart Communications|https://cdn.simpleicons.org/smart
Which brand logo is shown?|Telegram|https://cdn.simpleicons.org/telegram
Which brand logo is shown?|Discord|https://cdn.simpleicons.org/discord
Which brand logo is shown?|Twitch|https://cdn.simpleicons.org/twitch
Which brand logo is shown?|PayPal|https://cdn.simpleicons.org/paypal
Which brand logo is shown?|Visa|https://cdn.simpleicons.org/visa
Which brand logo is shown?|Mastercard|https://cdn.simpleicons.org/mastercard
Which brand logo is shown?|Toyota|https://cdn.simpleicons.org/toyota
Which brand logo is shown?|Honda|https://cdn.simpleicons.org/honda`, true)
    }
};
