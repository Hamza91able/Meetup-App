# Meetup Application React (Tinder Clone)
The following project is an assignment.
* Link to assignment document: https://docs.google.com/document/d/1stgvxHfyyHyHINKMppgrwBM_0DB3pOWt-vj6dylkF64/edit

* Front End: React
* Back End: Firebase
* Database: Firebase Realtime Database

## Features
1. **Login** with firebase authentication.
2. **Profile Screen:** After login first time, the profile screen will appear. It consists of three screens. 
  i) Enter your nickname and phone number, with a button next, on clicking it, 
  ii) It will show user, 3 placeholders for uploading pictures, on clicking each, user can upload his/her picture! All must be required!, on next button.
  iii) There will be a text “Select Beverages” with three boxes.
  a) Coffee b) Juice c) Cocktail with their respective images and another text “duration of meeting” with options a) 20 min b) 60 min c) 120 min. User can select multiple options, like COFFEE, JUICE, 60 min and 120 min.
3. **Map Screen:** On-clicking the next button, a map will appear with the user’s current location. Also allow user to move the marker to set his/her location accurately! on pressing submit button, all data will be stored in database inside the respective user’s data!
4. Dashboard Screen: On submitting, the dashboard screen will appear, initially, it will show a text “You haven’t done any meeting yet!”, try creating a new meeting! And a button, “Set a meeting!”.
5. **Meeting Screen:** On clicking “Set a meeting!” button, a screen will appear and presents all the users that matches the beverages and durations of current user! For e.g. Current User Selected COFFEE, JUICE, 60 min and 120 min, so all the other users having atleast one match with current user’s beverages and atleast one match with the duration would appear in the list and he/she will be atleast under 5km from your location! E.g. A user having COFFEE & 60 min should match with the current user.
  * The user info will be provided in a card and other cards will be in stack. That’s mean these cards will be swipeable
    * Swiping left or pressing X button means, user don’t wanna meet. So the next card (user) will be presented!
    * Swiping right or pressing _/ button means, user wanna meet this person, so it will show the popup with the meeting person’s name and a text “Do you want to meet <Person name>?”
6. **Meeting Point Selection Screen:** Using Foursquare Places API, it will show the nearest first three positions from user's selected location and an input bar to search for more locations.
  * On clicking to any location, there will be two buttons available, 
    i. Next: it will navigate to Date/Time Screen.
    ii. Get Directions: It will open the map, showing the direction routes from the user’s location to the selected location!
7. **Date/Time Selection Screen:** Will show a calendar to user to select the date/time and a SEND REQUEST button. On clicking it, it will ask the user to Send the request? If yes, then this request data will be stored in database.
8. Dashboard Screen: Now after first request, user's dashboard will show their meetings list with their statuses (PENDING / CANCELLED / ACCEPTED / COMPLICATED / DONE), list will be shown with these fields.
  * Avatar of the meeting requested user (2nd Person)
  * Name
  * Statuses
  * Date & Time
  * Location
9. **Request Popup:** After somebody requests a meeting with user, user will get a popup, with these fields.
  * Avatar of the both you and meeting requested user (2nd Person)
  * Name of the 2nd person
  * Meeting Duration
  * Location
  * Date and Time
  * Get Direction Button (Show map directions from your location to meeting location)
  * Confirm, Cancel Button
10. **Add Event to Calendar:** Uses this package to add event to any calendar.
  * https://jasonsalzman.github.io/react-add-to-calendar/ , so in the case of google, he or she will be notified.
11. **Edit User Profile:** User can edit his/her profile.

### Pending Features
1. **Post Meeting Popup:**  After the meeting date and time passed, both the users should be asked about “Was the meeting successful?”, and options would be “Yes” or “No”,
  * If both answered YES, the status of the meeting should be updated to DONE
  * If both answered NO, the status of the meeting should be updated to CANCELLED
  * If both answered differently, the status of the meeting should be updated to COMPLICATED
  * The status will appear on each’s Dashboards
2. **Ratings:** After answering to above popup, he/she should be asked for the rating to the opposite user (Out of 5), and ratings should be stored in the user’s object in firebase as an average of all previous ratings! The opposite person’s ratings will appear on your Dashboard and also when selecting a user for meeting!
3. **React Router.**
