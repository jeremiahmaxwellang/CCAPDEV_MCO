document.addEventListener("DOMContentLoaded", function () {

     // Fetch reservations from the backend
    let reservations = [];

    async function fetchReservations() {
        try {
            const response = await fetch("/all-reservations");
            if(!response.ok){
                throw new Error(`Error fetching reservations: ${response.status}`);
            }

            reservations = await response.json();
            console.log("🔍 Reservations Data:", reservations); // Debugging Log
    
            if (!Array.isArray(reservations) || reservations.length === 0) {
                console.warn("⚠️ No reservations available.");
            }

    
        } catch (error) {
            console.error("⚠️ Error fetching reservations:", error);
        }
    }

    fetchReservations(); // Fetch data from database on page load


    // Fetch User from the backend
    let User = {};

    async function fetchUser() {
        try {
            const response = await fetch("/get-current-user");
            if(!response.ok){
                throw new Error(`Error fetching User: ${response.status}`);
            }

            User = await response.json();
            console.log("🔍 Logged-in User:", User); // Debugging Log
    

    
        } catch (error) {
            console.error("⚠️ Error fetching logged in User:", error);
        }
    }

    fetchUser(); //Fetch logged-in user

    let students = [];
    async function fetchAllStudents() {
        try {
            const response = await fetch("/all-students");
            if(!response.ok){
                throw new Error(`Error fetching students: ${response.status}`);
            }

            students = await response.json();
            console.log("🔍 Students Data:", students); // Debugging Log
    
            if (!Array.isArray(students) || students.length === 0) {
                console.warn("⚠️ No students available.");
            }

    
        } catch (error) {
            console.error("⚠️ Error fetching students:", error);
        }
    }

    if(User.account_type != "Student") fetchAllStudents(); // Fetch data from database on page load



    const roomContainer = document.getElementById("room-container");
    const roomTitle = document.getElementById("room-title"); // Select the room title
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");
    const buildingDropdown = document.getElementById("building-location");

    const floorPositions = [0, 67, 140, 160, 229]; // Adjust slider positions
    let selectedFloor = 1; // Default floor
    let selectedBuilding = ""; // Default empty (forces user to select)

    function fetchRooms(building, floor) {
        if (!building || !floor) return; // Prevent API call if missing values

        fetch(`/available-rooms?building=${encodeURIComponent(building)}&floor=${floor}`)
            .then(response => response.json())
            .then(data => {
                roomContainer.innerHTML = ""; // Clear existing rooms

                // Update title to "Available Rooms"
                roomTitle.textContent = "Available Rooms";

                if (data.success && data.rooms.length > 0) {
                    data.rooms.forEach(room => {
                        const roomDiv = document.createElement("div");
                        roomDiv.classList.add("room-box");
                        roomDiv.innerHTML = `
                            <img src="images/goksdiv.png" alt="Room Image">
                            <div class="divider"></div>
                            <div class="room-info">
                                <div class="room-name">${room.room_num}</div>
                                <div class="room-details">
                                    Capacity: 20 <br>
                                    Projectors: 1 <br>
                                    Servers: 0
                                </div>
                            </div>
                        `;

                        roomDiv.addEventListener("click", () => {
                            showOverlay(room.room_num);
                        });

                        roomContainer.appendChild(roomDiv);
                    });
                } else {
                    roomContainer.innerHTML = "<p class='no-rooms'>No available rooms in this building and floor.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
                document.getElementById("room-container").innerHTML = "<p class='error-message'>Failed to load rooms.</p>";
            });
    }

   

    // Run when the user selects a building
    buildingDropdown.addEventListener("change", function () {
        selectedBuilding = buildingDropdown.value;

        // Change title from "Choose a Building" to "Available Rooms"
        roomTitle.textContent = "Available Rooms";

        fetchRooms(selectedBuilding, selectedFloor);
            
    });

    floorNumbers.forEach((floor, index) => {
        floor.addEventListener("click", function () {
            selectedFloor = floor.dataset.floor;
            sliderThumb.style.transform = `translateX(${floorPositions[index]}px)`;

            floorNumbers.forEach(f => f.classList.remove("selected"));
            floor.classList.add("selected");

            fetchRooms(selectedBuilding, selectedFloor);
        });
    });

    // Set slider thumb to first floor by default
    sliderThumb.style.transform = `translateX(${floorPositions[0]}px)`;
    floorNumbers[0].classList.add("selected");


function showOverlay(roomName) {
    

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");


    const mainOverlayContainer = document.createElement("div");
    mainOverlayContainer.classList.add("main-overlay-container");

    
    const reservationDetails = document.createElement("div");
    reservationDetails.classList.add("reservation-details");

    // Room Name Title
    const roomNameElement = document.createElement("h2");
    roomNameElement.textContent = `${roomName}`;
    reservationDetails.appendChild(roomNameElement);
    

    // Date-Time Selection
    const dateTimeContainer = document.createElement("div");
    dateTimeContainer.classList.add("date-time-container");

    // Date Picker
    const datePickerContainer = document.createElement("div");
    datePickerContainer.classList.add("date-picker-container");

    const datePickerLabel = document.createElement("label");
    datePickerLabel.textContent = "Select Date:";

    const datePicker = document.createElement("input");
    datePicker.id = "datePicker"; //datePicker ID
    datePicker.type = "date";
    
    datePicker.min = new Date().toISOString().split("T")[0];
    datePicker.value = new Date().toISOString().split("T")[0]; //display date today by default
    datePickerContainer.appendChild(datePickerLabel);
    datePickerContainer.appendChild(datePicker);

    // Time Picker
    const timePickerContainer = document.createElement("div");
    timePickerContainer.classList.add("time-picker-container");
    
    const timePickerLabel = document.createElement("label");
    timePickerLabel.textContent = "Select Time:";
    
    const timePicker = document.createElement("select");
    timePicker.id = "timePicker"
    
    for (let hour = 8; hour <= 19; hour++) { // Ends at 19:30
        for (let minute of [0, 30]) {
            let startHour = String(hour).padStart(2, "0");
            let startMinute = String(minute).padStart(2, "0");
    
            let endHour = hour;
            let endMinute = minute + 30;
            if (endMinute >= 60) {
                endMinute -= 60;
                endHour += 1;
            }
            let formattedEndHour = String(endHour).padStart(2, "0");
            let formattedEndMinute = String(endMinute).padStart(2, "0");
    
            let optionText = `${startHour}:${startMinute} - ${formattedEndHour}:${formattedEndMinute}`;
    
            const option = document.createElement("option");
            option.value = `${startHour}:${startMinute}`;
            option.textContent = optionText;
            timePicker.appendChild(option);
        }
    }

    // Student Dropdown Container
    const studentDropdownContainer = document.createElement("div");
    studentDropdownContainer.className = "dropdown-container";
    studentDropdownContainer.innerHTML =`
    <div class="dropdown-container">
        <label for="student-selection" class="dropdown-label">Assignee</label>
        <div class="custom-dropdown">
            <!-- Student Dropdown -->
            <select id="student-selection" class="dropdown-select">
                <option value="" selected>Select a Student</option>

            </select>
        </div>
    <div>
    `
    
    timePickerContainer.appendChild(timePickerLabel);
    timePickerContainer.appendChild(timePicker);
    dateTimeContainer.appendChild(datePickerContainer);
    dateTimeContainer.appendChild(timePickerContainer);
    reservationDetails.appendChild(dateTimeContainer);



    // Seat Info Overlay (Dynamically Updated)
    const seatInfoOverlay = document.createElement("div");
    seatInfoOverlay.classList.add("seat-info-overlay");
    seatInfoOverlay.innerHTML = `<p>Select a seat to see details.</p>`;
    reservationDetails.appendChild(seatInfoOverlay);

    const seatLayout = document.createElement("div");
    seatLayout.classList.add("seat-layout");

    // Seat Container
    const seatContainer = document.createElement("div");
    seatContainer.classList.add("seat-container");



    const myBuildingDropdown = document.getElementById("building-location")
    const building_id =  myBuildingDropdown.selectedIndex; // Capture the selected building ID



    // R = Reserved
    // A = Available
    const seatPositions = [
        ["A", "A", "A", "A", "A"],  //seatPositions[0]
        //0,   1,   2,   3,   4,    //Row 0   
        //==========================   

        ["R", "R", "R", "A", "R"],  //seatPositions[1]
        //5,   6,   7,   8,   9,    //Row 1
        ["R", "R", "A", "R", "R"],  //seatPositions[2]
        //==========================   

        ["R", "A", "R", "A", "R"]   //seatPositions[3]
    ];

    let selectedSeat = null;

    changeSeatColors();


// Sets the colors of the seats
function initializeSeats(){
    seatPositions.forEach((row, rowIndex) => {

        function isSeatReserved(mybuilding_id, myroomName, myseat_num){

            if(!Array.isArray(reservations) || reservations.length === 0){
                console.warn("No reservations available to check");
                return null;
            }
    
            const reservedDate = new Date(`${datePicker.value}T${timePicker.value}:00.000Z`);
            const formattedDate = reservedDate.toISOString()
    
            let matchedReservation = reservations.find(reservation =>
                reservation.building_id === mybuilding_id &&
                reservation.room_num === myroomName &&
                reservation.seat_num === myseat_num &&
                reservation.reserved_date == formattedDate
            );

    
            return matchedReservation || null;
        }


        // Create divider before specific rows
        if(rowIndex == 1 || rowIndex == 3){
            const divider = document.createElement("div");
            divider.classList.add("divider-bar");
            seatContainer.appendChild(divider);
        }

        const seatRow = document.createElement("div");
        seatRow.classList.add("seat-row");

        row.forEach((type, seatIndex) => {

            let seat_num = (rowIndex * 5) + seatIndex + 1; //get seat number

            const seat = document.createElement("img");
            seat.classList.add("seat-svg");

        let myReservation = isSeatReserved(building_id, roomName, seat_num) 

        // Available if no matching reservation
        if (myReservation == null) {
            seat.src = "images/GreenSeat.svg";
            seat.classList.add("available");
        }
        else {
            seat.src = "images/RedSeat.svg";
            seat.classList.add("reserved");
        }

        function updateDateTime(){
            // Expected format: 2025-03-18T00:00:00.000Z
            const reservedDate = new Date(`${datePicker.value}T${timePicker.value}:00.000Z`);
            const formattedDate = reservedDate.toISOString()

            document.getElementById("reserved_date").value = formattedDate
        }

        // Update hidden form input fields
        function updateInputs(){
            // Check if anonymous box is checked
            const anonymousCheckbox = document.getElementById("anonymousCheckbox")

            anonymousCheckbox.addEventListener("change", () => { 
                let anonStatus = "N"
        
                if(anonymousCheckbox.checked){
                    anonStatus = "Y"
                }
                
                document.getElementById("anonStatus").value = anonStatus
            })

            // Date updates when user changes selection
            datePicker.addEventListener("change", () => { 
                updateDateTime()
                
            })

            // Time updates when user changes selection
            timePicker.addEventListener("click", () => { 
                updateDateTime()
                
            })

             // Set the default values of the reservation
             updateDateTime()
             document.getElementById("building_id").value = building_id
             document.getElementById("room_num").value = roomName
             document.getElementById("seat_num").value = seat_num
             document.getElementById("anonStatus").value = "N"
        }

            seat.addEventListener("click", () => {
                if (seat.classList.contains("available") || seat.classList.contains("reserved")) {
                    // If another seat is already selected, reset it back to original color
                    if (selectedSeat) {
                        if (selectedSeat.classList.contains("available")) {
                            selectedSeat.src = "images/GreenSeat.svg";
                        } else if (selectedSeat.classList.contains("reserved")) {
                            selectedSeat.src = "images/RedSeat.svg";
                        }
                        selectedSeat.classList.remove("selected");
                    }

                    // Set new selected seat
                    selectedSeat = seat;
                    seat.src = "images/BlueSeat.svg";
                    seat.classList.add("selected");

                    // Update seat info overlay
                    if (seat.classList.contains("available") && User.account_type === "Student") {
                    
                    // Seat Overlay with FORM

                        seatInfoOverlay.innerHTML = `
                        <form method="post">
                            <p class="available-text">This Seat Is Available</p>
                            <div class="anonymous-container">
                                <input 
                                    type="checkbox" 
                                    id="anonymousCheckbox" 
                                    class="anonymous-checkbox" 
                                    name="anonymous"
                                    value="Y">
                                <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                            </div>

                            <div><input type="hidden" id="anonStatus" name="anonymous"></div>
                            <div><input type="hidden" id="reserved_date" name="reserved_date"></div>
                            <div><input type="hidden" id="building_id" name="building_id"></div>
                            <div><input type="hidden" id="room_num" name="room_num"></div>
                            <div><input type="hidden" id="seat_num" name="seat_num"></div>
                            
                            <button type="submit" class="confirm-btn">Confirm</button>
                        </form>
                        `;

                        updateInputs();
                        
                    } 

                    else if (seat.classList.contains("available") && User.account_type === "Lab Technician") {
                    

                        seatInfoOverlay.innerHTML = `
                        <form method="post">

                        <div class="form-container">
                            <p class="available-text">This Seat Is Available</p>

                            <div class="anonymous-container">
                                <input 
                                    type="checkbox" 
                                    id="anonymousCheckbox" 
                                    class="anonymous-checkbox" 
                                    name="anonymous-checkbox"
                                    value="Y">
                                <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                            </div>

                            

                            <div class="dropdown-container">
                                <label for="student-selection" class="anonymous-label">Reserve for:</label>
                                <div class="custom-dropdown">

                                    <select id="student-selection" class="dropdown-select" name="reserved_for_email">
                                        <option value="" selected>Select a Student</option>
                                    </select>

                                </div>
                            <div>

                            
                            <button type="submit" class="confirm-btn">Confirm</button>

                            <div><input type="hidden" id="anonStatus" name="anonymous"></div>
                            <div><input type="hidden" id="reserved_date" name="reserved_date"></div>
                            <div><input type="hidden" id="building_id" name="building_id"></div>
                            <div><input type="hidden" id="room_num" name="room_num"></div>
                            <div><input type="hidden" id="seat_num" name="seat_num"></div>
                            
                            
                        </div>    
                        </form>
                        `;

                        updateInputs()

                        // ✅ Set reservedForEmail from dropdown
                        function fillStudentDropdown() {
                            const dropdown = document.getElementById("student-selection");
                            students.forEach((student) => {
                                const option = document.createElement("option");
                                option.value = student.email;
                                option.textContent = student.email;
                                option.setAttribute("data-email", student.email);
                                dropdown.appendChild(option);
                            })
                        }
                    
                        fillStudentDropdown();
                        

                        
                    } 
                    // Overlay when seat is taken
                    else if (seat.classList.contains("reserved") && myReservation.anonymous === "N") {
                        seatInfoOverlay.innerHTML = `
                            <p class="occupied-text">This seat is Occupied by:</p>
                            
                             
                            <p class="occupied-email">
                            <a href="/profile">${myReservation.email}</a>
                            </p>
                            
                        `;

                        
                    }
                    else {
                        seatInfoOverlay.innerHTML = `
                            <p class="occupied-text">This seat is Occupied by:</p>
                            
                             
                            <p class="occupied-email">Anonymous</p>
                            
                        `;
                    }

                    // CONFIRM BUTTON LISTENER
                    document.querySelector(".confirm-btn")?.addEventListener("click", () => {

                        const seatNo = document.getElementById("seat_num").value

                        showConfirmationOverlay(roomName, datePicker.value, timePicker.value, seatNo);
                        const buildingDropdown = document.getElementById("building-location");
                        buildingDropdown.value = "Select a Building" //reset selected building

                    });
                }
            });

            seatRow.appendChild(seat);
        });
    
            seatContainer.appendChild(seatRow);
        
    });
    
}
    
// Called to change the seat colors when date or time is changed
function changeSeatColors(){
    // reset seat container
    while (seatContainer.firstChild) {
        seatContainer.removeChild(seatContainer.firstChild);
    }

    initializeSeats()
    
    // Reset seatInfoOverlay
    seatInfoOverlay.innerHTML = `<p>Select a seat to see details.</p>`;
}

datePicker.addEventListener("change", () => { 
    changeSeatColors()

})

timePicker.addEventListener("click", () => { 
    changeSeatColors()

})


    
    
    seatLayout.appendChild(seatContainer);

    const frontLabel = document.createElement("div");
    frontLabel.classList.add("front-label");
    frontLabel.textContent = "Front";
    seatLayout.appendChild(frontLabel);

    mainOverlayContainer.appendChild(reservationDetails);
    mainOverlayContainer.appendChild(seatLayout);
    overlayContent.appendChild(mainOverlayContainer);

const closeButton = document.createElement("button");
closeButton.classList.add("close-button");
closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome X icon
closeButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
});

    overlayContent.appendChild(closeButton);
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
}






function showConfirmationOverlay(roomName, date, time, seatNumber) {
    const confirmationOverlay = document.createElement("div");
    confirmationOverlay.classList.add("overlay");

    const confirmationContent = document.createElement("div");
    confirmationContent.classList.add("confirmation-content");


    const name = User.first_name

    // Extract day & month
    const tempDate = new Date(date);
    const day = tempDate.getDate(); 
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[tempDate.getMonth()];


    // Extract time
    const timeString = time;

    const [hour, minute] = timeString.split(":").map(Number);
    const startTime = new Date();
    startTime.setHours(hour, minute, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);

    function format12HourTime(date) {
        let hours = date.getHours();
        let minutes = String(date.getMinutes()).padStart(2, "0");
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12
        return `${hours}:${minutes} ${ampm}`;
    }

    // Extract seat number
    const seat = new Number(seatNumber);

    // Building Name
    const building = document.getElementById("building-location").value;


    confirmationContent.innerHTML = `
        <div class="confirmation-header">
            <i class="fas fa-check-circle"></i>
            <h2>Your Reservation is <span class="confirmed-text">Confirmed</span></h2>
        </div>
        <hr>
        <p class="confirmation-message">Hi, ${name}</p>
        <p class="confirmation-subtext">
            You have successfully reserved a room and slot, please review your reservation details below
        </p>
        
        <div class="confirmation-container">
            <img class="room-image" src="images/goksdiv.png" alt="Room Image">
            <div class="confirmation-details">
                <h1 class="reservation-date">${day}</h1>
                <p class="reservation-month">${month}</p>
                <p class="reservation-time">${format12HourTime(startTime)} - ${format12HourTime(endTime)}</p>
                <hr>
                <p class="reservation-reference">Seat #${seat}</p>
                <p class="reservation-building">Building: ${building}</p>
                <p class="reservation-room">Room: ${roomName}</p>
            </div>
        </div>

        <button class="home-btn" onclick="window.location.href='/dashboard'">Go Back to Home Page</button>


        </button>
    `;

    confirmationOverlay.appendChild(confirmationContent);
    document.body.appendChild(confirmationOverlay);
}

function closeConfirmation() {
    document.querySelector(".overlay").remove();
}


});