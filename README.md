# 'Easy Cards' a card based study tool
## Built as a final project for NEWMN-N423 Fall 2022

### Authentication
Users are required to login or create an account before accessing the site. This can be done using email or with Google authentication.

### Create, Read, Update, and Delete your sets!
Easy Cards allows the user to create a set of study cards with a front and back to each card. These sets can either be public or private, with the public decks being searchable by other users as well as saveable to their list of Favorite decks. The owner of a set can edit the title, visibility, as well as any of the cards in that set from the set view or 'My Sets' page. From the My Sets page a user can also fully delete a study set. By clicking on the title of a deck in the My Sets page, one can view all cards in that set - clicking on the card displays the other side of it. 

### Search and Favorite other user's sets
When searching for other user's decks (by title), you may click on the heart symbol next to the title of that deck and add it to your list of favorite decks. Clicking on that heart symbol again will remove that set from your favorites. When viewing another user's deck, the heart symbol is available next to the title of that deck. The Favorites page will display your favorited sets in a list very similar to the My Sets page; however, the edit and delete buttons are replaced by the heart symbol. 

### View all of another user's sets
When viewing another user's deck, either from the Favorites or Search pages, you may click on the username of the person who created the deck and view a list of all of their public decks. 

### Profile Page
Currently, a user's profile page only displays their username and a signout button. Clicking the signout button will log them out of the site and bring them back to the login/register screen.

### Technical Details
This application was developed using the following technologies: HTML/CSS, SASS, JavaScript, jQuery, Firebase Authentication, and Firestore db. The application was developed as a single page applciation and uses an Object-Oriented MVC architecture. This application uses Webpack to compile all of the JS modules into a single bundle. 
