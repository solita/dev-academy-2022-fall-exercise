## TODO
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

* ~~List all the stations~~

#### Additional

* ~~Pagination~~
* ~~Searching~~

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
* Add test suite
* Endpoints to store new journeys data or new bicycle stations
* ~~Running backend in Docker~~
* Running backend in Cloud
* Implement E2E tests
* Create UI for adding journeys or bicycle stations