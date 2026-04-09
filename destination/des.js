




        const destinations = [
            { id: 1, name: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", description: "The City of Light, famous for the Eiffel Tower, art, and romance", link: "https://www.parisinfo.com" },
            { id: 2, name: "Tokyo", country: "Japan", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", description: "A vibrant metropolis blending ancient traditions with modern innovation", link: "https://www.gotokyo.org" },
            { id: 3, name: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800", description: "The city that never sleeps, iconic skyline and diverse culture", link: "https://www.nycgo.com" },
            { id: 4, name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", description: "Luxury destination with stunning architecture and desert adventures", link: "https://www.visitdubai.com" },
            { id: 5, name: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800", description: "Gaudí's masterpieces, beautiful beaches, and vibrant culture", link: "https://www.barcelonaturisme.com" },
            { id: 6, name: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", description: "Ancient history, stunning architecture, and world-class cuisine", link: "https://www.turismoroma.it" },
            { id: 7, name: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", description: "Historic landmarks, royal palaces, and diverse neighborhoods", link: "https://www.visitlondon.com" },
            { id: 8, name: "Sydney", country: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", description: "Iconic Opera House, beautiful harbor, and pristine beaches", link: "https://www.sydney.com" },
            { id: 9, name: "Istanbul", country: "Turkey", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800", description: "Where East meets West, rich history and stunning mosques", link: "https://www.istanbul.com" },
            { id: 10, name: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", description: "Tropical paradise with temples, rice terraces, and beaches", link: "https://www.bali.com" },
            { id: 11, name: "Amsterdam", country: "Netherlands", image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800", description: "Charming canals, historic architecture, and cycling culture", link: "https://www.iamsterdam.com" },
            { id: 12, name: "Prague", country: "Czech Republic", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", description: "Fairy-tale architecture and medieval old town charm", link: "https://www.prague.eu" },
            { id: 13, name: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800", description: "White-washed buildings, stunning sunsets, and blue domes", link: "https://www.santorini.com" },
            { id: 14, name: "Maldives", country: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", description: "Luxury overwater villas and pristine coral reefs", link: "https://www.visitmaldives.com" },
            { id: 15, name: "Cairo", country: "Egypt", image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800", description: "Ancient pyramids, Sphinx, and rich pharaonic history", link: "https://www.egypt.travel" },
            { id: 16, name: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800", description: "Carnival, Christ the Redeemer, and Copacabana Beach", link: "https://www.visit.rio" },
            { id: 17, name: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800", description: "Golden temples, street food, and vibrant nightlife", link: "https://www.bangkok.com" },
            { id: 18, name: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", description: "Futuristic city-state with gardens and diverse culture", link: "https://www.visitsingapore.com" },
            { id: 19, name: "Venice", country: "Italy", image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800", description: "Romantic canals, gondolas, and Renaissance art", link: "https://www.veneziaunica.it" },
            { id: 20, name: "Marrakech", country: "Morocco", image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800", description: "Colorful souks, palaces, and Sahara gateway", link: "https://www.visitmarrakech.com" },
            { id: 21, name: "Petra", country: "Jordan", image: "https://plus.unsplash.com/premium_photo-1675700414747-d16f2bda6420?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGV0cmElMjBKT1JEQU58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500", description: "Ancient rose-red city carved into rock faces", link: "https://www.visitpetra.jo" },
            { id: 22, name: "Machu Picchu", country: "Peru", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800", description: "Mystical Incan citadel high in the Andes", link: "https://www.machupicchu.gob.pe" },
            { id: 23, name: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", description: "Traditional temples, geishas, and cherry blossoms", link: "https://www.kyoto.travel" },
            { id: 24, name: "Reykjavik", country: "Iceland", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800", description: "Northern lights, geysers, and volcanic landscapes", link: "https://www.visitreykjavik.is" },
            { id: 25, name: "Lisbon", country: "Portugal", image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", description: "Historic trams, colorful tiles, and Fado music", link: "https://www.visitlisboa.com" },
            { id: 26, name: "Vienna", country: "Austria", image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800", description: "Imperial palaces, classical music, and coffee culture", link: "https://www.wien.info" },
            { id: 27, name: "Cape Town", country: "South Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800", description: "Table Mountain, beaches, and wildlife safaris", link: "https://www.capetown.travel" },
            { id: 28, name: "Seoul", country: "South Korea", image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800", description: "K-pop culture, palaces, and modern technology", link: "https://www.visitseoul.net" },
            { id: 29, name: "Mumbai", country: "India", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800", description: "Bollywood, diverse culture, and historic Gateway", link: "https://www.mumbai.org.uk" },
            { id: 30, name: "Buenos Aires", country: "Argentina", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800", description: "Tango, European architecture, and steak houses", link: "https://www.bue.gov.ar" },
            { id: 31, name: "Dubrovnik", country: "Croatia", image: "https://images.unsplash.com/photo-1414862625453-d87604a607e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RHVicm92bmlrJTIwQ1JPQVRJQXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500", description: "Medieval walls, Game of Thrones filming location", link: "https://www.dubrovnik-online.com" },
            { id: 32, name: "Edinburgh", country: "Scotland", image: "https://images.unsplash.com/photo-1645819575688-28937daa611d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2074", description: "Historic castle, festivals, and Scottish heritage", link: "https://www.edinburgh.org" },
            { id: 33, name: "Havana", country: "Cuba", image: "https://plus.unsplash.com/premium_photo-1697730131336-01d0886e8865?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332", description: "Vintage cars, cigars, and colonial architecture", link: "https://www.havana-guide.com" },
            { id: 34, name: "Mecca", country: "Saudi Arabia", image: "https://images.unsplash.com/photo-1720549973451-018d3623b55a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjY2ElMjBtb3NxdWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500", description: "Holiest city, pilgrimage destination, spiritual center.", link: "https://mecca.net/" },
            { id: 35, name: "Queenstown", country: "New Zealand", image: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", description: "Adventure capital with stunning alpine scenery", link: "https://www.queenstownnz.co.nz" },
            { id: 36, name: "Vancouver", country: "Canada", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800", description: "Mountains meet ocean, multicultural city", link: "https://www.tourismvancouver.com" },
            { id: 37, name: "Florence", country: "Italy", image: "https://images.unsplash.com/photo-1541845157-a6d2d100c931?w=800", description: "Renaissance art, Michelangelo's David, and Duomo", link: "https://www.feelflorence.it" },
            { id: 38, name: "Phuket", country: "Thailand", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800", description: "Tropical beaches, islands, and vibrant nightlife", link: "https://www.visitphuket.com" },
            { id: 39, name: "Cancun", country: "Mexico", image: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800", description: "Caribbean beaches, Mayan ruins, and resorts", link: "https://www.cancun.travel" },
            { id: 40, name: "Banff", country: "Canada", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", description: "Canadian Rockies, turquoise lakes, and wildlife", link: "https://www.banfflakelouise.com" }
        ];

        let currentPage = null;

        function renderDestinations(dests = destinations) {
            const grid = document.getElementById('destinationsGrid');
            grid.innerHTML = dests.map(dest => `
                <div class="destination-card" onclick="showDestination(${dest.id})">
                    <div class="card-image" style="background-image: url('${dest.image}')"></div>
                    <div class="card-content">
                        <div class="card-title">${dest.name}</div>
                        <div class="card-country">${dest.country}</div>
                        <div class="card-description">${dest.description}</div>
                    </div>
                </div>
            `).join('');
        }

        function showDestination(id) {
            const dest = destinations.find(d => d.id === id);
            currentPage = id;
            
            const content = `
                <button class="back-button" onclick="showHome()">← Back to Destinations</button>
                <div class="page-header">
                    <div class="page-header-image" style="background-image: url('${dest.image}')"></div>
                    <div>
                        <div class="page-title">${dest.name}</div>
                        <div class="page-subtitle">${dest.country}</div>
                    </div>
                </div>
                <p style="font-size: 18px; line-height: 1.8; color: #64748b; margin-bottom: 30px;">
                    ${dest.description}
                </p>
                <a href="${dest.link}" target="_blank" class="page-link">Visit Official Website →</a>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>🎯 Best Time to Visit</h3>
                        <p>The ideal time to explore ${dest.name} is during the spring and fall seasons when the weather is pleasant and perfect for sightseeing and outdoor activities.</p>
                    </div>
                    <div class="info-card">
                        <h3>🍽️ Local Cuisine</h3>
                        <p>Experience authentic local flavors and traditional dishes that reflect the rich culinary heritage of ${dest.country}. Don't miss the street food and local markets.</p>
                    </div>
                    <div class="info-card">
                        <h3>🏨 Where to Stay</h3>
                        <p>From luxury hotels to budget-friendly hostels, ${dest.name} offers accommodations for every traveler. Consider staying in the city center for easy access to attractions.</p>
                    </div>
                    <div class="info-card">
                        <h3>✨ Top Attractions</h3>
                        <p>Discover iconic landmarks, hidden gems, museums, and cultural sites that make ${dest.name} a must-visit destination. Book tours in advance during peak season.</p>
                    </div>
                </div>
            `;
            
            document.getElementById('pageContent').innerHTML = content;
            document.getElementById('pageContent').classList.add('active');
            document.getElementById('homePage').style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function showHome() {
            currentPage = null;
            document.getElementById('pageContent').classList.remove('active');
            document.getElementById('homePage').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function filterDestinations() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filtered = destinations.filter(dest => 
                dest.name.toLowerCase().includes(searchTerm) || 
                dest.country.toLowerCase().includes(searchTerm) ||
                dest.description.toLowerCase().includes(searchTerm)
            );
            renderDestinations(filtered);
        }

        renderDestinations();
