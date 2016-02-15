
$(document).ready(function () {

    //Add click event for adding a new person.
    $("#btnAddPerson").click(myNameSpace.AddPerson);
    $("#btnSwapColumns").click(myNameSpace.SwapColumns);


    //Add event handlers to the parent in the table and delegate the sort functions to the parent when the user clicks on the child elements text
    $("#tablePerson tr th").on('click', "#colFirstName", myNameSpace.SortByFirstName);
    $("#tablePerson tr th").on('click', "#colLastName", myNameSpace.SortByLastName);
    $("#tablePerson tr th").on('click', "#colId", myNameSpace.SortById);
    $("#tablePerson tr th").on('click', "#colPhone", myNameSpace.SortByPhone);
    $("#tablePerson tr th").on('click', "#colEmail", myNameSpace.SortByEmail);

    $("#tablePerson").on("click", "td", function ()
    {
        

        if ($(this).parent().index() > 0)
        {
            $(this).parent().fadeOut(1500, function () {
                $(this).remove();
                UpdateBarChart(GetAgeDistribution());
                UpdatePieChart(FemaleMaleDistribution());
            });
            
            
        }

    });

    // Add options to swap columns.
    myNameSpace.AddOptions("ddlLeftColumn");
    myNameSpace.AddOptions("ddlRightColumn");

   
    
    // update age distribution chart.
    UpdateBarChart( GetAgeDistribution());
    UpdatePieChart(FemaleMaleDistribution());
    
    

});






var myNameSpace = {

    //Method responsible for adding a new person to the table with id ?.
    AddPerson: function () {
        // Create a new Person.
        var person = new Person($("#firstName").val(), $('#lastName').val(), $('#ssn').val(), $('#phone').val(), $('#email').val());

        var newRow = "<tr>";

        //Place person properties in the right column
        for (var i = 0; i < Object.keys(person).length; i++) {

            newRow += "<td><div>";

            if ($("#colFirstName").parent().index() == i) {
                newRow += person.FirstName;
            }

            if ($("#colLastName").parent().index() == i) {
                newRow += person.LastName;
            }

            if ($("#colId").parent().index() == i) {
                newRow += person.SSN;
            }

            if ($("#colPhone").parent().index() == i) {
                newRow += person.Phone;
            }

            if ($("#colEmail").parent().index() == i) {
                newRow += person.Email;
            }

            newRow += "</div></td>";

        }
        newRow += "</tr>";

        $("#tablePerson tr:last").after(newRow);
      

        $("#tablePerson tr:last div").css('opacity', 0).fadeTo(1500, 1.0, function () {
            
            //// update charts.
            UpdatePieChart(FemaleMaleDistribution());
            UpdateBarChart(GetAgeDistribution())

        });
        


        ////// update charts.
        //UpdatePieChart(FemaleMaleDistribution());
        //UpdateBarChart(GetAgeDistribution())
       
    },

    // Method sorting the table by firstname.
    SortByFirstName: function () {
        SortByColumn($("#colFirstName").parent().index());

    }
    ,
    // Metod sorting the table by lastname.
    SortByLastName: function () {
        SortByColumn($("#colLastName").parent().index());
    },
    //Method sorting the table by id.
    SortById: function () {
        SortByColumn($("#colId").parent().index());
    },
    // Method sorting the table by phone.
    SortByPhone: function () {
        SortByColumn($("#colPhone").parent().index());
    }
    ,
    // Method sorting the table by Email.
    SortByEmail: function () {
        SortByColumn($("#colEmail").parent().index());
    },
    // Metod sorting the table by lastname.
    AddOptions: function (id) {

        $("#tablePerson tr th").each(function (i, td) {
           
            $("#" + id).append($("<option></option>").attr("value", $(td).find("div").attr("id")).text($(td).find("div").text()));
        });

    },
    // Method 
    SwapColumns: function () {
        SwapColumns($("#ddlLeftColumn").val(), $("#ddlRightColumn").val())
    }

}

//Method returning 
function GetAgeDistribution() {
    var ages = [0, 0, 0, 0, 0, 0];

    $("#tablePerson").table("refresh");


    $("#tablePerson tr td:nth-child(" + ($("#colId").parent().index() + 1) + ") div:nth-child(2)").each(function (i, td) {

        // Calculate the current persons age.
   
        var year = $(td).text().split('-')[0].substring(0, 4);
        var month = $(td).text().split('-')[0].substring(4, 6);
        var day = $(td).text().split('-')[0].substring(6, 8);
        var birthDay = new Date(year, month, day);
        var today = new Date();
        var age = Math.floor((today - birthDay) / (1000 * 3600 * 23 * 365.25));


        // Get age distribution.
        if (age < 20) {
         
            ages[0] = ages[0] + 1;
        }
        else if (age >= 20 && age < 30)
        {
        
            ages[1] = ages[1] + 1;
        }
        else if (age >= 30 && age < 40)
        {
         
            ages[2] = ages[2] + 1;

        }
        else if (age >= 40 && age < 50)
        {
         
            ages[3] = ages[3] + 1;

        }
        else if (age >= 50 && age < 60) {
            
            ages[4] = ages[4] + 1;
        }
        else if (age >= 60) {
        
            ages[5] = ages[5] + 1;

        }
        
       
    });



    return ages;
}


//Method returning 
function FemaleMaleDistribution() {
    
    var distribution = [0, 0];
    var females = 0;
    var males = 0;

    $("#tablePerson").table("refresh");
    
    $("#tablePerson tr td:nth-child(" + ($("#colId").parent().index() + 1) + ") div:nth-child(2)").each(function (i, td) {


        if($(td).text().split('-')[1].substring(2, 3) % 2 == 1)
        {
            females += 1; 
        }
        else
        {
            males += 1;
        }

       
    });

    // calclutare procentage male.
    distribution[0] = Math.round((males)/(males + females)*100);
    distribution[1] = Math.round((females) / (males + females) * 100);

  
    return distribution; 
  
}






// third number even = female odd = male; 
function UpdatePieChart(distribution)
{
    var barchartContext = $("#chartBarChart").get(0).getContext("2d");

    var data = [
  
    {
        value: distribution[0],
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Male"
    },
    {
        value: distribution[1],
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Female"
    }
    ];
    


    var myDoughnutChart = new Chart(barchartContext).Doughnut(data);




}



function UpdateBarChart(ages) {
    var chartContext = $("#chartWithAgeDistribution").get(0).getContext("2d");

    var data = {
        labels: ["Below 20 years", "20-30 years", "30-40 years", "40-50 years", "50-60 years", "over 60 years"],
        datasets: [
            {
                label: "Year",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: ages
            }
        ]
    };

    var chartAgeDistribution = new Chart(chartContext).Bar(data);
}


// Method using selection sort to sort a column in people table.
function SortByColumn(index) {

    var col = index;

    var personTable = document.getElementById("tablePerson");

    for (var i = 1; i < personTable.rows.length; i++) {

        var min = i;

        for (var j = i + 1; j < personTable.rows.length; j++) {

            if (personTable.rows[j].cells[col].innerHTML < personTable.rows[min].cells[col].innerHTML) {
                min = j;
            }
        }

        if (min != i) {

            var tmpRow = personTable.rows[i].innerHTML;
            personTable.rows[i].innerHTML = personTable.rows[min].innerHTML;
            personTable.rows[min].innerHTML = tmpRow;
        }

    }
}

// Method that swaps data between two columns in thw person table.
function SwapColumns(idColumnOne, idColumnTwo) {


    // Index of columns to swap. 
    var columnIndexOne = $("#" + idColumnOne).parent().index();
    var columnIndexTwo = $("#" + idColumnTwo).parent().index();

    // Swap cells on each row based on the column index above.
    $("#tablePerson tr").each(function (i, row) {

        var tmpCellContent = $(row).find("th").eq(columnIndexTwo).html();
        $(row).find("th").eq(columnIndexTwo).html($(row).find("th").eq(columnIndexOne).html());
        $(row).find("th").eq(columnIndexOne).html(tmpCellContent);


    });


    // Swap cells on each row based on the column index above.
    $("#tablePerson tr").each(function (i, row) {

        var tmpCellContent = $(row).find("td").eq(columnIndexTwo).html();
        $(row).find("td").eq(columnIndexTwo).html($(row).find("td").eq(columnIndexOne).html());
        $(row).find("td").eq(columnIndexOne).html(tmpCellContent);


    });

}

//Class representing a person 
function Person(firstName, lastName, ssn, phone, email) {
    // Properties in class Person 
    this.FirstName = firstName;
    this.LastName = lastName;
    this.SSN = ssn;
    this.Phone = phone;
    this.Email = email;


}









