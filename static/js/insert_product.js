$(document).ready(function () {
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
            { "data": 0 },
            { "data": 1 },
            { "data": 2 },
            { "data": 3 },
            { "data": 4 },
            { "data": 5 },
            { "data": 6 },
            { "data": 7 },
            {
                "data": null,
                "render": function (data) {
                    return '<a href=""><strong>Edit</strong></a>';
                }
            },
            {
                "data": null,
                "render": function (data) {
                    return '<a href=""><strong>Delete</strong></a>';
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

    // Apply the search
    $('#example_filter input').on('keyup change', function () {
        table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

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
                        <input type="text" class="form-control" id="exampleInputDOB" aria-describedby="">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" id="exampleInputAddress">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPincode" class="form-label">Pincode</label>
                        <input type="text" class="form-control" id="exampleInputPincode" aria-describedby="">
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputCity" class="form-label">City</label>
                        <input type="text" class="form-control" id="exampleInputCity">
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" id="exampleMale" value="Male">
                        <label class="form-check-label" for="exampleMale">
                            Male
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="gender" id="exampleFemale" value="Female">
                        <label class="form-check-label" for="exampleFemale">
                            Female
                        </label>
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

    document.getElementById('item-add-form').onsubmit = async function (event) {
        event.preventDefault();

        // Get selected gender value
        var gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : '';
        console.log(gender, "*******************8");

        const formData = new FormData();
        formData.append("first_name", document.getElementById("exampleInputFirstName").value);
        formData.append("last_name", document.getElementById("exampleInputLastName").value);
        formData.append("dob", document.getElementById("exampleInputDOB").value);
        formData.append("address", document.getElementById("exampleInputAddress").value);
        formData.append("pincode", document.getElementById("exampleInputPincode").value);
        formData.append("city", document.getElementById("exampleInputCity").value);
        formData.append("gender", gender);

        // Send formData to your server
        const response = await fetch("api/insertcontact", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Contact Data inserted successfully", data);
        } else {
            console.log("Failed to insert contact data");
        }

        const button = document.getElementById('modalCloseButton');
        button.addEventListener('click', () => {
            // Reset form after closing modal
            document.getElementById('item-add-form').reset();
        });
        button.click();
    }
});
