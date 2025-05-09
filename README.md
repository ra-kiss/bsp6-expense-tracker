### Home/Dashboard
- [ ] Display available balance (money left to spend)
- [ ] Progress bar showing budget allocation
	- [ ] How much is left in the budget?
	- [ ] How much is allocated to recurring expenses?
- [ ] First Pie chart showing distribution of spending w.r.t. categories
- [ ] Second Pie chart showing distribution of spending w.r.t. currencies
- [ ] Line chart showing value fluctuation of the main currency against a selected reference currency
- [ ] Display usage statistics: total spent, total saved, average expense by category, average expense by currency, most/least used category, most/least used currency

### Transactions
- [x] Show list of transactions with relevant details
- [x] Each transaction should display: currency, amount, date, category, and notes which can include images
- [x] Filter list by category
- [x] Filter list by currency
- [x] Filter list by time frame (e.g. last year, last month, last week)
- [x] Sort list by value (asc./desc.)
- [x] Sort list by time (asc./desc.)
- [x] Support only adding one transaction field in order to make a valid transaction
- [x] Support editing and deleting transactions
- [x] Set up recurring expenses
	- [x] Allow users to define the frequency (daily, weekly, monthly, yearly)
	- [x] Show users upcoming recurring expenses in advance
	- [ ] Allow users to edit recurring expenses
- [x] Allow user-defined transaction templates
- [ ] Allow users to modify transaction templates

### Savings
- [x] Allow user to create new savings project with a target amount
- [x] Allow user to edit savings projects
- [ ] Automatically transfer leftover budget to savings goal at some interval (weekly, monthly) 
- [ ] Display warnings when the savings goal is not on track (e.g. insufficient funds to meet the savings goal)
- [ ] Warnings should be visible on all pages: it should be a persistent notification
- [x] Allow users to see how much they have saved so far comparatively to the goal
- [x] Allow users to sort projects by completion
- [ ] (Optionally) Allow users to filter projects by currency

### Currencies
- [ ] Display comparison values w.r.t main currency for all currencies
- [ ] Allow user to add custom currency with custom exchange rate w.r.t. their chosen main currency
- [ ] (Optionally) Allow user to filter currencies by custom/default
- [ ] (Optionally) Allow users to sort currencies by value

### Options
- [x] Set or change main currency
- [x] Set or change budget
- [x] Set or change income frequency 
- [x] Add or remove categories 
- [ ] Allow export and importing of transactions, savings goals, and custom currencies
- [ ] (Optionally) Implement PIN for security 
- [ ] (Optionally) Add language preference
- [ ] (Optionally) Dark/Light mode color scheme with customizable accent colors
