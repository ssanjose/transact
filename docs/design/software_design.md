# Software Design

## Overview
This document outlines the software design choices made for the Transact App.

## Design Patterns
- Singleton for database connection
- Factory for creating transactions

## Modules
- Account Module
- Transaction Module
- Category Module

## Data Flow
### User inputs data through the UI
1. User submits the form
2. Component uses controllers to handle form submissions
3. After transaction, the UI automatically updates

### Data is processed by controllers
Controllers interact with the database and handle CRUD functions to manage model states. They do this by:
1. Controller method is called from the ui component passing model state as params.
2. Controller method creates a database transaction and begins handling the transaction.
3. On specific methods, the controller may return an object after the transaction has been committed.
4. In case of errors, the ui component must handle the error.
5. In some database models, the controller may inform the event manage about recent changes in the database.

### An event manager has been informed
The event manage will get informed and starts up workers depending on their use case. In which:

1. Worker(s) will get a message to do what the message conveys:
    - They have a preset number of operations i.e. recalculate queue, account balance changes
2. Worker(s) will do the said operation
3. Worker informs event manager what has been done.
4. Event manager informs user through sonner or notification.

The event can be thought of as a broker between the user and the worker. While the worker can be seen as a bank employee.

### After the user has been informed back by the event manager
1. The app might refreshed or redirected to a different page.
2. If the app is refreshed or re-rendered, results may be displayed back to the user