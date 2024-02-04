Backend Book Store Service Introduction
- https://www.postman.com/crimson-eclipse-915936/workspace/bookstore/request/15957373-883724c3-57cd-45a5-94e7-650ce201b405

This repository contains the backend implementation for a Book Store
Application, focusing on user management, book management, purchase
history, and revenue tracking for authors. 

Entities Users Types are : 

Author ,Admin, Retail Users

Books Attributes

bookId: Unique identifier (e.g., book-1, book-2, \...) 
authors: Single or multiple authors 
sellCount: Either stored in the database or computed dynamically based on purchase history 
title: Unique string value (used
as a slug for the book URL) 
description: Book description 
price: Range
value between 100 and 1000

Purchase History Attributes

Unique ID format: {{YEAR}}-{{MONTH}}-{{numeric increment id}}
purchaseId: Unique ID format: {{YEAR}}-{{MONTH}}-{{numeric increment id}}
bookId: Unique identifier of the book purchased 
userId: Unique identifier of the user who purchased the book 
purchaseDate: Date of purchase 
price: Price of the book at the time of purchase 
quantity: Number of books purchased

Revenue Tracking for Authors

Increase in author\'s revenue on user purchase Notify authors about
purchase information Email authors with current month, current year, and
total revenue

Implementation Guidelines User Management

Implement user authentication and authorization. Use different roles for
authors, admin, and retail users.

Book Management

Ensure the uniqueness of bookId and title. Implement logic for computing
sellCount based on book purchases. Validate the price within the
specified range.

Purchase History

Implement a database structure to store purchase records. Generate
unique IDs for each purchase following the specified format. Ensure
numeric value for purchaseId is not missed or duplicated on the
application level. Implement proper synchronization to handle race
conditions.

Revenue Tracking

Implement a mechanism to send email notifications to authors. Include
revenue details in the email (current month, current year, total
revenue).

Email Notification

Use a background job or a message queue to handle email notifications
asynchronously. Include relevant purchase information in the email. Add
a feature for sending bulk email notifications to all retail users about
new book releases. Implement a condition to handle sending a maximum of
100 emails per minute.

Sell Count Calculation

The sellCount for each book is calculated dynamically based on the book
purchase history. Whenever a user makes a purchase, the sellCount is
updated for the corresponding book by adding the purchased quantity.
This ensures an accurate representation of the book\'s popularity and
sales.

Email Async Bulk

Trigger for Email Notification: The email notification process is
triggered after successfully saving the book information in the
database.

Retrieve Users and Authors: All retail users\' emails are retrieved from
the User model. This is done to notify all users about the new book. The
authors\' details associated with the book are retrieved for notifying
them individually.

Define Email Content: The email content is defined using details from
the newly created book, such as title, price, and quantity.

Send Bulk Emails: The system sends email notifications to both users and
authors. A loop iterates through each user\'s email and each author\'s
email for the given book. For each combination of user and author, an
email notification is sent using the sendNotif function.

Delay Between Emails: To comply with the condition of sending a maximum
of 100 emails per minute, there\'s a delay introduced between each
email. This ensures that the system does not exceed the specified email
sending rate.

Notification Details: The sendNotif function likely includes details
such as the book title, price, and possibly the author\'s email to
provide relevant information to the recipients.

In summary, the email handling process involves retrieving user and
author information, defining the content of the email notification,
sending bulk emails with a controlled rate, and including relevant
details in the notifications. This ensures that both retail users and
authors are informed about the new book release in a timely and
organized manner.

Database design

The provided code establishes a well-structured database design for a
book-selling platform using MongoDB and Mongoose. Three models---Book,
PurchaseHistory, and User---are defined with careful consideration for
data integrity and functionality. The Book model utilizes ObjectId and
references to establish relationships with the User model for authors,
implements unique constraints, and introduces soft deletion through the
isDeleted field. The PurchaseHistory model captures purchase
information, generating unique and readable purchaseIds and maintaining
associations with the Book and User models. The User model includes a
userType field for categorization, a revenue array for tracking author
revenue, and a unique constraint on the email field. Overall, the design
emphasizes relational connections, data integrity, and practical
features for a robust and scalable book-selling platform.
