# Google App script for saving Gmail messages to Google Sheets/CSV

This script may be run in the Google Apps Script interface in order to extract email messages (metadata and plain text) from the user's Gmail account and save them to a Google Sheet. 

## Requirements

1. A Google account (personal or enterprise) with access to the Apps Script interface.
2. A Gmail account.
3. Access to Google Drive.

## Instructions

### Setting up the script

1. Create a new folder in your Google Drive.
3. Within the folder, click the **New** button (with the plus sign) from the Drive menu on the left.
4. From the drop-down menu, select **More** then click **Google Apps Script**. This will open the Apps Script interface in a new browser tab/window.

<img width="543" alt="Screenshot 2025-04-20 at 3 15 17 PM" src="https://github.com/user-attachments/assets/5540ba1c-da68-4a22-a235-db2c929022f5" />

4. When the warning about folder access pops up, click the **Create script** button.

You should now be looking at the Apps Script workspace. There should be a menu to the left with entries like `Files`, `Libraries`, and `Services`, and some buttons (greyed out) along the top. In the center should be a large blank area with some default code, starting with the line `function myFunction() {`. 

5. Highlight and delete everything in this area. Now you will copy and paste the code from this GitHub repository into your new, blank Google Apps Script project.
6. Open the file in this GitHub repository called `gmail_to_csv.js`. (You can open it by clicking on it, and the contents will be displayed in the GitHub code viewer.)
7. Copy all of the code in the GitHub code pane by clicking on the pane, pressing `Ctrl-A` (Windows) or `Cmd-A` (Mac) to select everything, and then `Ctrl-C` (Windows) or `Cmd-C` (Mac).
8. Now go back to your Google Apps Script project. Click on the area that you cleared in step 5 and press `Ctrl-V` (Windows) or `Cmd-V` (Mac) to paste the code.
9. If you copied and pasted the code correctly, the last line in the Apps Script code pane should have the line number `167`.
10. At the top of the Apps Script workspace, click the floppy disc icon to save the script to your Drive.

<img width="628" alt="Screenshot 2025-04-20 at 3 29 48 PM" src="https://github.com/user-attachments/assets/cfab5966-c3f9-4f60-906a-f71603d80f03" />

### Setting up the Google Sheet

11. You can leave the Apps Script workspace tab open, but go back to the tab open to the folder you created in Google Drive, and create a new Google Sheet. This sheet will contain the metadata and text of the emails retrieved by the script.
12. Open the sheet. Rename the default tab on the sheet (called `Sheet1`) to **config**. (You must name it exactly; if the script can't find a tab called `config`, it won't work.)
13. On the `config` tab, you will input the date parameters to be used by the script. The script needs a start date and, optionally, an end date. Only emails between these dates will be retrieved.
    
  - In the first, top-left cell of the sheet. insert the word **start**. (The script will look for the presence of this word, in lowercase.)-
  -  In the cell immediately below `start`, enter a date in the following format: `YYYY/MM/DD`. This is the first date from which emails will be retrieved.
  - In the B1 cell, enter the word **end**.
  - In the cell below (B2), enter an end date in the same format: `YYYY/MM/DD`.
    
<img width="269" alt="Screenshot 2025-04-20 at 3 39 51 PM" src="https://github.com/user-attachments/assets/d2a98fab-20d1-4040-b479-1ac804a1f2d0" />

If you don't supply an end date, the script will attempt to retrieve all emails from the start date up to the current date. However, unless your start date is relatively recent, this approach is not recommended. It's better to retrieve emails in batches, i.e. a year or even a few months at a time. See below for details on how to do this.
    
14. In order to connect the script to your sheet, you **must add the Sheet ID to the script**. To do this, look at the URL bar in your browser when viewing the sheet. The id is the part of the URL between the characters `d/` and `/edit`. Copy this portion of the URL. (Don't copy the beginning or ending slashes.)
15. In the Google Apps Script tab, paste the Sheet ID into the first line of the script, **between the empty quotation marks**. The first line of the script should then look something like this:
    
<img width="557" alt="Screenshot 2025-04-20 at 3 44 02 PM" src="https://github.com/user-attachments/assets/fdc1c3bf-a4d3-4553-a3e6-c54786166dd7" />

(Make sure the ID string is between the quotation marks; otherwise, the script will not work.

16. Save the script again, using the floppy disc button on the toolbar at the top.

### Running the script

When the script is run, it will look for a `config` tab on the sheet whose ID you supplied, and it will retrieve the  `start` and `end` dates from that `config` tab. It will use those dates to retrieve all messages in Gmail between those dates, saving each message and its metadata to a row in a new tab on the same sheet, which it will name `data`. (There's no need to create the `data` tab; the script will do this automatically.)

17. To run the script, first select `main` from the drop-down window in the toolbar, which by default will probably read `prepSheet`. **Make sure `main` is selected before running the script, or else it will not work.**
    
<img width="582" alt="Screenshot 2025-04-20 at 3 48 40 PM" src="https://github.com/user-attachments/assets/c06f2d5d-2207-4877-a21d-99c41c88b498" />

18. With `main` selected, click the **Run** button (with the right-facing triangle) on the toolbar.
19. The first time running the script, you'll need to grant it permissions to a) access your Gmail account and b) write to your Google Drive. Click the button to **review permissions**.

<img width="500" alt="Screenshot 2025-04-20 at 3 51 25 PM" src="https://github.com/user-attachments/assets/d82d446c-741f-421f-af06-f5449ed304e9" />

20. Select the Google account that you want to use. (This should be same account as the one you've used to create the script and the Google Sheet, the account whose emails you wish to retrieve.)

<img width="501" alt="Screenshot 2025-04-20 at 3 51 37 PM" src="https://github.com/user-attachments/assets/fabe8b36-4ea2-48d7-98a5-a4b0e2d85935" />

21. If you see a pop up with a red triangle warning you about unsafe apps (you may or may not see this), you will need to click the **Advanced** link and click on your email address to accept the risk.
22. Now you'll need to grant the app permissions to access your Gmail account and your Google Drive. **Check the box to grant all permissions.**

<img width="519" alt="Screenshot 2025-04-20 at 3 53 20 PM" src="https://github.com/user-attachments/assets/ae6aa284-319d-4628-b893-9ac0612d3979" />

(Note that the script above does not write or delete any data to or from your Gmail account. It will only read data and write the latter to your Google Drive.) 

23. Once you grant permissions and continue, the app should begin to run. In the execution log at the bottom of the Apps Script workspace, you should see some messages regarding its progress.


<img width="1096" alt="Screenshot 2025-04-20 at 4 00 04 PM" src="https://github.com/user-attachments/assets/a1deda69-356d-4526-955e-c5bb6729aeed" />

24. Once it's finished, the final line should read `Execution completed`. Now your emails (for the date range supplied) should have been saved to the `data` tab on your Google Sheet.

### Usage notes and caveats

#### Batching and efficiency

- The Apps Script Gmail API is **slow**. Depending on the volume of email messages and the time range supplied, it may take quite a while to run. Moreover, Google Apps scripts are not permitted to run indefinitely, so the execution may time out at some point prior to completion. For that reason, I strongly recommend running the script in batches for a large volume of emails. For instance, I used it to retrieve messages from my account one calendar year at a time. (For each year, it took approximately 20-30 minutes to complete.)
- If the script times out or encounters another error, you'll see the error reported in the execution log. In the event of a timeout, you can note the last date for which messages were retrieved (from the `data` tab in your Google Sheet), and enter that date (plus one day) as the `start` date on the `config` tab. Then run the script again -- if the `data` tab already exists and contains data, the script will append new messages to the bottom.
- The preceding method also works for downloading messages in batches: i.e. set the `start` and `end` dates to the beginning and end of a particular year, run the script, and when it has finished, update the dates to the next year, run the script again, etc.
- You may want to rename the `data` tab after each run, so that the next run will create a new `data` tab. This approach will make the script more efficient over several runs, since it won't have to read all the previous runs' data into memory in order to add new data.
- Google imposes a limit on how many messages can be retrieved per day. If you hit this limit, you'll see the corresponding error in the logs. If that happens, you'll need to wait 24 hours before running the script again. 

#### Privacy and security

- The script will only run for the Gmail account to which you grant it access, and no one can grant such a script access to an account to which they do not already have access. So in that sense, the script is safe.
- But if you are using this script within an organizational/enterprise Gmail account, be aware that retrieving your emails in this fashion **may** violate your organization's IT policies and/or run afoul of applicable privacy laws (e.g., HIPAA, FERPA).
- In any event, please keep your email data secure! Your emails may contain the personally identifying information of other individuals. I recommend downloading the `data` tab (and any others created by the script) as CSV files, and then compressing and encrypting the CSV files for added security.
  -  On a Mac, you can use the `zip` command in the [Terminal](https://www.canr.msu.edu/news/encrypted-zip-mac) to do this.
  -  On a Windows PC, a tool like [7-Zip](https://www.uvic.ca/systems/support/informationsecurity/fileencryption/encryptfile7zip.php#:~:text=In%20the%20%22Archive%22%20field%2C,the%20%22Reenter%20passphrase%22%20field.) is recommended.
  -  Once you've downloaded the CSV files, delete the Google Sheet from your Drive (to prevent your accidentally sharing it with anyone else).
 
#### Limitations

- This script retrieves all messages in all threads that meet the search criteria. By default, the criteria must include a date range. You can add additional criteria by modifying the `QUERY_STR` variable in the script (line 3): insert a valid Gmail search expression between the single quotes, and that query will be applied (in addition to the date range) in order to filter messages for retrieval.
- The script retrieves the basic email metadata (to, from, date, cc, and subject) as well as the plaintext message body. It does not retrieve the formatted body of the message, nor does it retrieve attachments. (Retrieving attachments for a large volume of messages is inefficient using the Gmail API and could easily exceed Google's daily usage limits.)
- For similar reasons, the script does **not** retrieve the email headers. The header information is necessary to authenticate an email message, e.g., in a legal proceeding. If you have messages for which you think you might need the headers, I recommend that you download them individually, using the option in the Gmail interface to [show the original] (https://support.google.com/mail/answer/29436?hl=en#zippy=%2Cgmail). 
