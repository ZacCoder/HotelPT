const form = document.getElementById('hotelForm');
const hotelsTable = document.getElementById('hotelsBody');

function createHotelRow(hotel) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${hotel.name}</td>
        <td>${hotel.location}</td>
        <td>${hotel.rating}</td>
        <td>
            <button class="delete-btn" data-id="${hotel._id}">Delete</button>
            <button class="update-btn" data-id="${hotel._id}">Update</button>
        </td>
    `;
    return row;
}

function loadHotels() {
    fetch('https://zaccoder.github.io/hotels')
        .then(response => response.json())
        .then(data => {
            hotelsTable.innerHTML = '';
            data.forEach(hotel => {
                const row = createHotelRow(hotel);
                hotelsTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading hotels:', error));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const rating = document.getElementById('rating').value;
    const hotelData = { name, location, rating };

    fetch('https://zaccoder.github.io/hotels', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
    })
    .then(response => response.json())
    .then(data => {
        const row = createHotelRow(data);
        hotelsTable.appendChild(row);
        form.reset();
    })
    .catch(error => console.error('Error adding hotel:', error));
});

hotelsTable.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        deleteHotel(id);
    } else if (e.target.classList.contains('update-btn')) {
        const id = e.target.getAttribute('data-id');
        updateHotel(id);
    }
    
});
function deleteHotel(id) {
    fetch(`https://zaccoder.github.io/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete hotel');
        }
        loadHotels();
    })
    .catch(error => console.error('Error deleting hotel:', error));
}

function updateHotel(id) {
    const name = prompt('Enter updated hotel name:');
    const location = prompt('Enter updated hotel location:');
    const rating = prompt('Enter updated hotel rating:');
    const hotelData = { name, location, rating };

    fetch(`https://zaccoder.github.io/${id}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(hotelData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update hotel');
        }
        loadHotels();
    })
    .catch(error => console.error('Error updating hotel:', error));
}

loadHotels()
