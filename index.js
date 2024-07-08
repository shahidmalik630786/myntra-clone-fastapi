// $(document).ready(function () {
    async function DataTable() {
        var table = $('#example').DataTable({
            
            "processing": true,
            "serverSide": true,
            "ajax": {
                "url": "api/get_all_products",
                "type": "GET",
                "datatype": "json",
                "data": function (d) {
                    return {
                        draw: d.draw,
                        start: d.start,
                        length: d.length,
                        search: d.search.value
                    };
                },
                "dataSrc": function (json) {
                    return json.data;
                }
            },
            "columns": [
                { 
                    "data": function (row, type, set, meta) {
                        return meta.row;
                    }
                },
                { "data": 1 },
                { "data": 2 },
                { "data": 3 },
                { "data": 4 },
                { "data": 5 },
                { "data": 6 },
                { "data": 7 },
                {
                    "data": function (row) {
                        return row[0];
                    },
                    "render": function (data, type, row, meta) {
                        let dataIndex = meta.row; // This is the index of the current row
    
                        // Modal and button HTML with dynamic loop value
                        return `<div id="item-update-form">
                                    <button id="upadate-item-id" type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModalUpdate${dataIndex}"
                                        onclick="updateForm(${dataIndex})">Edit</button>
                                </div>
                                <!-- Modal -->
                                <div class="modal fade" id="exampleModalUpdate${dataIndex}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Contact</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form class="text-start" id="item-add-form">
                                                    <div class="mb-3">
                                                        <label for="exampleInputFirstName" class="form-label">First Name</label>
                                                        <input type="text" class="form-control" id="exampleInputFirstNameUpdate${dataIndex}" aria-describedby="">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleInputLastName" class="form-label">Last Name</label>
                                                        <input type="text" class="form-control" id="exampleInputLastNameUpdate${dataIndex}">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleInputDOB" class="form-label">DOB</label>
                                                        <input type="date" class="form-control" id="exampleInputDOBUpdate${dataIndex}" aria-describedby="">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleInputAddress" class="form-label">Address</label>
                                                        <input type="textbox" class="form-control" id="exampleInputAddressUpdate${dataIndex}">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleInputPincode" class="form-label">Pincode</label>
                                                        <input type="number" class="form-control" id="exampleInputPincodeUpdate${dataIndex}" aria-describedby="">
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleInputCity" class="form-label">City</label>
                                                        <input type="text" class="form-control" id="exampleInputCityUpdate${dataIndex}">
                                                    </div>
                                                    <div class="mb-3 form-check">
                                                        <label class="" for="exampleCheck1">Male</label>
                                                        <input type="radio" class="form" id="exampleMaleUpdate${dataIndex}" value="Male" name="genderUpdate${dataIndex}">
                                                        <label class="" for="exampleCheck1">Female</label>
                                                        <input type="radio" class="form" id="exampleFemaleUpdate${dataIndex}" value="Female" name="genderUpdate${dataIndex}">
                                                    </div>
                                                    <button type="submit" class="btn btn-primary" onclick="updateContact(event, id, '${dataIndex}')">Submit</button>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" id="modalCloseButton${dataIndex}" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    "data": function (row) {
                        return row[0];
                    },
                    "render": function (data, type, row, meta) {
                        let dataIndex = meta.row; // This is the index of the current row
    
                        // Delete button HTML with dynamic loop value
                        return `<button type="button" class="btn btn-danger"  onclick="deleteButton(${data})" >Delete</button>`;
                    }
                }
            ],
            "select": true,
            "colReorder": true,
            "searching": true,
            "paging": true,
            "lengthChange": true,
            "ordering": true,
            "info": true,
            "autoWidth": true
        });
    }
    DataTable()

    // search function
    $('#example_filter input').on('keyup change', function () {
        table.column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });


    // Insert functinoality
    const cardBody = document.createElement("div");
    cardBody.innerHTML = `
    <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Insert
    </button>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Contact</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
            <div class="modal-body">
                <form class="text-start" id="item-add-form">
                    <div class="mb-3">
                        <label for="exampleInputFirstName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="exampleInputFirstName" aria-describedby="">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputLastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="exampleInputLastName">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputDOB" class="form-label">DOB</label>
                        <input type="date" class="form-control" id="exampleInputDOB" aria-describedby="">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputAddress" class="form-label">Address</label>
                        <input type="textbox" class="form-control" id="exampleInputAddress">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPincode" class="form-label">Pincode</label>
                        <input type="number" class="form-control" id="exampleInputPincode" aria-describedby="">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputCity" class="form-label">City</label>
                        <input type="text" class="form-control" id="exampleInputCity">
                    </div>
                     <div class="mb-3 form-check">
                        <label class="" for="exampleCheck1">Male</label>
                        <input type="radio" class="form" id="exampleMale" value="Male" name="gender">
                        <label class="" for="exampleCheck1">Female</label>
                        <input type="radio" class="form" id="exampleFemale" value="Female" name="gender">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        <div class="modal-footer">
            <button type="button" id="modalCloseButton" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div>
        </div>
    </div>
    </div>
    `;

    $("#example_filter").addClass("d-flex");
    $("#example_filter").append(cardBody);



    // insert funstion api call
    document.getElementById('item-add-form').onsubmit = async function (event) {
        event.preventDefault();

        var gender = document.querySelector('input[name="gender"]:checked').value;
        console.log(gender, "*******************8")

        const formData = new FormData();
        formData.append("first_name", document.getElementById("exampleInputFirstName").value);
        formData.append("last_name", document.getElementById("exampleInputLastName").value);
        formData.append("dob", document.getElementById("exampleInputDOB").value);
        formData.append("address", document.getElementById("exampleInputAddress").value);
        formData.append("pincode", document.getElementById("exampleInputPincode").value);
        formData.append("city", document.getElementById("exampleInputCity").value);
        formData.append("gender", gender);


        const button = document.getElementById('modalCloseButton');
        button.addEventListener('click', () => {
            document.getElementById('item-add-form').reset();
        });
        button.click();

        try {
            const response = await fetch("/api/insertcontact", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Contact Data inserted successfully", data);

                document.getElementById('item-add-form').reset();
                $('#exampleModal').modal('hide');
            } else {
                console.error("Failed to insert contact data");
            }
        } catch (error) {
            console.error("Error:", error);
        }

    }
// });

// delete function api call
async function deleteButton(id) {
    const formData = new FormData();
    formData.append("id", id);

    try {
        const response = await fetch("/api/deletecontact", {
            method: "DELETE",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Contact Data deleted successfully");
            $('#example').DataTable().destroy();
            DataTable()
        } else {
            console.error("Failed to delete contact data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Edit
async function updateForm(data){
    var row = $(`tbody tr:eq(${data})`);
    var firstName = row.find('td:eq(1)').text();
    console.log(firstName);
    const firstname = document.getElementById(`exampleInputFirstNameUpdate${data}`).value = row.find('td:eq(1)').text();
    console.log(firstname)
    const lasttname = document.getElementById(`exampleInputLastNameUpdate${data}`).value = row.find('td:eq(2)').text();
    document.getElementById(`exampleInputDOBUpdate${data}`).value = row.find('td:eq(3)').text();
    document.getElementById(`exampleInputAddressUpdate${data}`).value = row.find('td:eq(4)').text();
    document.getElementById(`exampleInputPincodeUpdate${data}`).value = row.find('td:eq(5)').text();
    document.getElementById(`exampleInputCityUpdate${data}`).value = row.find('td:eq(6)').text();
    const gender = row.find('td').eq(7).text();
    document.getElementById(`exampleMaleUpdate${data}`).checked = (gender === 'Male');
    document.getElementById(`exampleFemaleUpdate${data}`).checked = (gender === 'Female');
}


//update function api call
async function updateContact(event, id, data) {
    event.preventDefault();
    var gender = document.querySelector(`input[name=genderUpdate${data}]:checked`).value;
    var formData = new FormData();
    formData.append('id', data);
    formData.append('first_name', document.getElementById(`exampleInputFirstNameUpdate${data}`).value);
    formData.append('last_name', document.getElementById(`exampleInputLastNameUpdate${data}`).value);
    formData.append('dob', document.getElementById(`exampleInputDOBUpdate${data}`).value);
    formData.append('address', document.getElementById(`exampleInputAddressUpdate${data}`).value);
    formData.append('pincode', document.getElementById(`exampleInputPincodeUpdate${data}`).value);
    formData.append('city', document.getElementById(`exampleInputCityUpdate${data}`).value);
    formData.append('gender', gender);

    const button = document.getElementById(`modalCloseButton${data}`);
    button.addEventListener('click', () => {
        document.getElementById('item-add-form').reset();
    });
        button.click();
        try {
            const response = await fetch('/api/updatecontact', {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Contact Data Updated successfully');
                $('#example').DataTable().destroy();
                DataTable()

            } else {
                console.error('Failed to update contact data:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
}