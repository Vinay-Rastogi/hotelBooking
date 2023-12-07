document.addEventListener('DOMContentLoaded', async function () {
    const backendBaseUrl = 'http://localhost:3000';

    function displayErrorMessage(message) {
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.innerText = message;
    }

    function getAuthToken() {
        return localStorage.getItem('jwtToken');
    }

    function getAuthRequestOptions() {
        const authToken = getAuthToken();
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken ? `${authToken}` : '',
            },
        };
    }

    function isLoggedIn() {
        return !!getAuthToken();
    }

    function redirectToLogin() {
        if (!isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }

    function redirectToHome() {
        if (isLoggedIn()) {
            window.location.href = 'viewAllBooking.html';
        }
    }

    function redirectToBookHotel() {
        if (isLoggedIn()) {
            window.location.href = 'bookHotel.html'
        }
    }

    function redirectToEditAddress() {
        if (isLoggedIn()) {
            window.location.href = 'editAddress.html'
        }
    }

    if (document.body.id === 'loginPage') {
        redirectToHome();
        document.getElementById('loginFormButton').addEventListener('click', submitLoginForm);
    }

    if (document.body.id === 'signupPage') {
        document.getElementById('signupFormButton').addEventListener('click', submitSignupForm);
    }

    if (document.body.id === 'bookHotelPage') {
        redirectToLogin();
        document.getElementById('viewAllBooking').addEventListener('click', () => { window.location.href = 'viewAllBooking.html' });
        document.getElementById('logout').addEventListener('click', logout);
        document.getElementById('bookHotelFormButton').addEventListener('click', submitHotelBookingForm);
        document.getElementById('standardRoomBtn').addEventListener('click',bookStandardRoom);
        document.getElementById('deluxeRoomBtn').addEventListener('click',bookDeluxeRoom);
        document.getElementById('suiteRoomBtn').addEventListener('click',bookSuiteRoom);
    }

    if (document.body.id === 'viewBookings') {
        redirectToLogin();
        fetchAllBookings();
        document.getElementById('logout').addEventListener('click', logout);
        document.getElementById('cancelBookingBtn').addEventListener('click', cancelRecentBooking);
        document.getElementById('bookHotelBtn').addEventListener('click', redirectToBookHotel);
        document.getElementById('editBookingAddressBtn').addEventListener('click', redirectToEditAddress);
    }

    if (document.body.id === 'editBookingAddress') {
        document.getElementById('editBookingAddressBtn').addEventListener('click', editBookingAddress);
        document.getElementById('viewBookings').addEventListener('click', redirectToHome);
        document.getElementById('logout').addEventListener('click', logout);
    }

    async function submitLoginForm() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            displayErrorMessage('Please enter both email and password.');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful!');
                localStorage.setItem('jwtToken', data.token);
                redirectToHome();
            } else {
                displayErrorMessage('Invalid email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
    }

    async function submitSignupForm() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!firstName || !lastName || !email || !address || !password) {
            displayErrorMessage('Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, address, email, password }),
            });

            if (response.ok) {
                alert('Signup successful!');
                redirectToLogin();
            } else {
                displayErrorMessage('Registration failed. Please try again later.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
    }

    async function submitHotelBookingForm() {

        const address = document.getElementById('address').value;

        if (!address) {
            displayErrorMessage('Please enter the delivery address.');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/book-Hotel`, {
                method: 'POST',
                ...getAuthRequestOptions(),
                body: JSON.stringify({ address }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message) {
                    alert('Booking Successful!');
                    redirectToHome();
                } else {
                    displayErrorMessage('Unknown response format');
                }
            } else {
                const errorRes = await response.json();
                // alert(errorRes.error);
                displayErrorMessage((errorRes.error + ' Redirecting to booking page in 5 seconds') || 'An error occurred. Redirecting to booking page in 5 seconds');
                setTimeout(redirectToHome, 5000);
            }
        } catch (error) {
            console.error('Error during Hotel booking:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
    }

    async function bookStandardRoom(){
         
            const dateOfBooking  = document.getElementById('bookingDate').value;
            const roomType = "Standard Room";

            if(!dateOfBooking){
              displayErrorMessage('Please enter the date of booking.');
             return;
            }

            try {

                const response = await fetch(`${backendBaseUrl}/book-Hotel`, {
                    method: 'POST',
                    ...getAuthRequestOptions(),
                    body: JSON.stringify({ dateOfBooking }),
                });
    
                if (response.ok) {
                    const res = await response.json();
                    if (res.message) {
                        alert('Booking Successful!');
                        redirectToHome();
                    } else {
                        displayErrorMessage('Unknown response format');
                    }
                } else {
                    const errorRes = await response.json();
                    // alert(errorRes.error);
                    displayErrorMessage((errorRes.error + ' Redirecting to booking page in 5 seconds') || 'An error occurred. Redirecting to booking page in 5 seconds');
                    setTimeout(redirectToHome, 5000);
                }
                  
            }
            catch (error) {
                console.error('Error during Hotel booking:', error);
                displayErrorMessage('An error occurred. Please try again later.');
            }
    }

    async function bookDeluxeRoom(){
         
        const dateOfBooking  = document.getElementById('bookingDate').value;
        const roomType = "Deluxe Room";

        if(!dateOfBooking){
          displayErrorMessage('Please enter the date of booking.');
         return;
        }

        try {

            const response = await fetch(`${backendBaseUrl}/book-Hotel`, {
                method: 'POST',
                ...getAuthRequestOptions(),
                body: JSON.stringify({ dateOfBooking }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res.message) {
                    alert('Booking Successful!');
                    redirectToHome();
                } else {
                    displayErrorMessage('Unknown response format');
                }
            } else {
                const errorRes = await response.json();
                // alert(errorRes.error);
                displayErrorMessage((errorRes.error + ' Redirecting to booking page in 5 seconds') || 'An error occurred. Redirecting to booking page in 5 seconds');
                setTimeout(redirectToHome, 5000);
            }
              
        }
        catch (error) {
            console.error('Error during Hotel booking:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
}

async function bookDeluxeRoom(){
         
    const dateOfBooking  = document.getElementById('bookingDate').value;
    const roomType = "Suite Room";

    if(!dateOfBooking){
      displayErrorMessage('Please enter the date of booking.');
     return;
    }

    try {

        const response = await fetch(`${backendBaseUrl}/book-Hotel`, {
            method: 'POST',
            ...getAuthRequestOptions(),
            body: JSON.stringify({ dateOfBooking }),
        });

        if (response.ok) {
            const res = await response.json();
            if (res.message) {
                alert('Booking Successful!');
                redirectToHome();
            } else {
                displayErrorMessage('Unknown response format');
            }
        } else {
            const errorRes = await response.json();
            // alert(errorRes.error);
            displayErrorMessage((errorRes.error + ' Redirecting to booking page in 5 seconds') || 'An error occurred. Redirecting to booking page in 5 seconds');
            setTimeout(redirectToHome, 5000);
        }
          
    }
    catch (error) {
        console.error('Error during Hotel booking:', error);
        displayErrorMessage('An error occurred. Please try again later.');
    }
}



    async function cancelRecentBooking() {
        try {
            const response = await fetch(`${backendBaseUrl}/cancel-recent-booking`, {
                method: 'DELETE',
                ...getAuthRequestOptions(),
            });

            if (response.ok) {
                const res = await response.json();
                if (res === 'Booking canceled successfully!') {
                    alert('Last booking canceled!');
                    window.location.reload();
                } else {
                    displayErrorMessage('Unknown response format');
                }
            } else {
                const errorRes = await response.json();
                displayErrorMessage(errorRes.error || 'Error canceling recent booking.');
            }
        } catch (error) {
            console.error('Error during cancelRecentBooking:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
    }

    async function editBookingAddress() {
        const updatedAddress = document.getElementById('address').value;

        if (!updatedAddress) {
            displayErrorMessage('Please enter the delivery address.');
            return;
        }

        try {
            const response = await fetch(`${backendBaseUrl}/update-address`, {
                method: 'PUT',
                ...getAuthRequestOptions(),
                body: JSON.stringify({ updatedAddress }),
            });

            if (response.ok) {
                const res = await response.json();
                if (res === 'Address Updated successfully!') {
                    alert('Address Updated successfully');
                    redirectToHome();
                } else {
                    displayErrorMessage('Unknown response format');
                }
            } else {
                const errorRes = await response.json();
                displayErrorMessage(errorRes.error || 'Error Updating Address');
            }
        } catch (error) {
            console.log('Error during editBookingAddress:', error);
            displayErrorMessage('An error occurred. Please try again later.');
        }
    }

    async function fetchAllBookings() {
        try {
            const response = await fetch(`${backendBaseUrl}/user-bookings`, {
                method: 'GET',
                ...getAuthRequestOptions(),
            });

            if (response.ok) {
                const allBookings = await response.json();
                const allBookingsList = document.getElementById('allBookingsList');
                console.log(allBookings);

                if (allBookings.length <= 0) {
                    console.log("Does Not have any Booking");
                    document.getElementById('cancelBookingBtn').style.display = "none";
                    document.getElementById('noBookingsMessage').classList.remove('displayMessage');
                    document.getElementById('noBookingsMessage').style.color = 'red';
                } else {
                    allBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
                    allBookings.forEach(booking => {
                        document.getElementById('allBookingsList').style.color = 'black';
                        const listItem = document.createElement('li');
                        listItem.style.padding = '1%';
                        listItem.innerHTML = `
                            <p><strong>Booking ID:</strong> <span class="address">${booking._id}</span></p>
                            <p><strong>Address:</strong> <span class="address">${booking.address}</span></p>
                            <p><strong>Booking Date:</strong> <span class="booking-date">${new Date(booking.bookingDate).toLocaleString()}</span></p>
                            <hr>
                        `;
                        allBookingsList.appendChild(listItem);
                    });
                }
            } else {
                console.error('Error fetching all bookings:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during fetchAllBookings:', error);
        }
    }



    function logout() {
        localStorage.removeItem('jwtToken');
        redirectToLogin();
    }
});
