# Helsinki city bike app (Dev Academy pre-assignment)
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

* ~~Import data from the CSV files to a database or in-memory storage~~
* ~~Validate data before importing~~
* ~~Don't import journeys that lasted for less than ten seconds~~
* ~~Don't import journeys that covered distances shorter than 10 meters~~

### Journey list view

#### Recommended

* ~~List journeys: For each journey show departure and return stations, covered distance in kilometers and duration in minutes~~

#### Additional

* ~~Pagination~~
* ~~Ordering per column~~
* ~~Searching~~
* ~~Filtering~~

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

## Extra
* Endpoints to store new journeys data or new bicycle stations
* ~~Running backend in Docker~~
* Running backend in Cloud
* Implement E2E tests
* Create UI for adding journeys or bicycle stations