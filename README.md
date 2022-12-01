# Helsinki city bike app (Dev Academy pre-assignment)

This is the pre-assignment for Solita Dev Academy Finland 2023. But if you’re here just purely out of curiosity, feel free to snatch the idea and make your own city bike app just for the fun of it!

Let's imagine that you have received an interesting project offer to create a UI and a backend service for displaying data from journeys made with city bikes in the Helsinki Capital area.

For the exercise download three datasets of journey data. The data is owned by City Bike Finland.

* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

Also, there is a dataset that has information about Helsinki Region Transport’s (HSL) city bicycle stations.

* Dataset: <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>
* License and information: <https://www.avoindata.fi/data/en/dataset/hsl-n-kaupunkipyoraasemat/resource/a23eef3a-cc40-4608-8aa2-c730d17e8902>

If you have trouble downloading the datasets, please contact heikki.hamalainen@solita.fi or meri.merkkiniemi@solita.fi 

## The exercise

Create a web application that uses a backend service to fetch the data.
Backend can be made with any technology. We at Solita use for example (not in preference order) Java/Kotlin/Clojure/C#/TypeScript/Go but you are free to choose any other technology as well.

Backend can use a database, or it can be memory-based. Real database use is a preferable choice because it allows you to show broader skills. Also, the datasets are quite big so in-memory operations may be quite slow.

You can also freely choose the frontend (and possibly mobile frontend) technologies to use. The important part is to give good instructions on how to build and run the project.

## Stuff to do

**Important!** Implementing all of the proposed features is not needed for a good exercise result. You may also concentrate on:

* Good documentation (readme/other docs)
* Proper git usage (small commits, informative commit messages)
* Tests
* Getting features complete
* Writing good code

Which are all highly valued in a good repository.

You can read more about tips from Solita Dev Blog: [Do's and Dont's of Dev Academy Pre-assignments](https://dev.solita.fi/2021/11/04/how-to-pre-assignments.html)

Also you can read Solita Dev Blog: [Testing Primer](https://dev.solita.fi/2022/11/01/testing-primer-dev-academy.html)

## Functional requirements

Focus on the recommended features. For extra points, you might want to also complete some additional features. You can also come up with extra features, if you do, please document them in the readme!

### Data import

#### Recommended

* Import data from the CSV files to a database or in-memory storage
* Validate data before importing
* Don't import journeys that lasted for less than ten seconds
* Don't import journeys that covered distances shorter than 10 meters

### Journey list view

#### Recommended

* List journeys
  * If you don't implement pagination, use some hard-coded limit for the list length because showing several million rows would make any browser choke
* For each journey show departure and return stations, covered distance in kilometers and duration in minutes

#### Additional

* Pagination
* Ordering per column
* Searching
* Filtering

### Station list

#### Recommended

* List all the stations

#### Additional

* Pagination
* Searching

### Single station view

#### Recommended

* Station name
* Station address
* Total number of journeys starting from the station
* Total number of journeys ending at the station

#### Additional
* Station location on the map
* The average distance of a journey starting from the station
* The average distance of a journey ending at the station
* Top 5 most popular return stations for journeys starting from the station
* Top 5 most popular departure stations for journeys ending at the station
* Ability to filter all the calculations per month

## Surprise us with

* Endpoints to store new journeys data or new bicycle stations
* Running backend in Docker
* Running backend in Cloud
* Implement E2E tests
* Create UI for adding journeys or bicycle stations

## Returning the exercise

If you wish to apply to Dev Academy, make sure to add the link to your GitHub repository to the application.
