const SHEET_ID = ""; // Supply the ID of the Google Sheet where the emails will be stored

const QUERY_STR = ''; // Optionally, supply a query string, following the Gmail search syntax: https://support.google.com/mail/answer/7190?hl=en&co=GENIE.Platform%3DAndroid

const DATA_COLUMNS = ['threadId', 'messageId', 'date', 'to', 'from', 'cc', 'subject', 'body'];

function prepSheet() {
  ss = SpreadsheetApp.openById(SHEET_ID);
  // Load date range from a tab called config
  config = ss.getSheetByName("config").getDataRange().getValues();
  if ((config[0][0] != "start") || (config.length != 2)) {
    Logger.log("Please make sure the the config tab has a column labeled 'start', which should contain a date.");
    return;
  } 
  let startDate = new Date(config[1][0])
  if (!(startDate instanceof Date) || (isNaN(startDate))) {
    Logger.log("Please provide a valid start date of the format YYYY/MM/DD.");
  } 
  let endDate = config[1][1] == "" ? new Date() : new Date(config[1][1]);

  // Add a tab to store email data
  
  let dataSheet = ss.getSheetByName('data');
  if (dataSheet == null) {
    dataSheet = ss.insertSheet('data');
    dataSheet.getRange(1, 1, 1, DATA_COLUMNS.length).setValues([DATA_COLUMNS]);
  }
  return {startDate: startDate,
          endDate: endDate,
          dataSheet: dataSheet};
}

function incrementDateRange(currentDate) {
  // increment the given date by 3 days
  let nextDate = new Date(currentDate);
  let d = nextDate.getDate();
  // JS months start with 0
  nextDate.setDate(d + 3);
  return nextDate;

}

function extractMessageMetadata(message, id) {
  return {messageId: id,
                  to: message.getTo(),
                  from: message.getFrom(),
                  date: message.getDate(),
                  cc: message.getCc(),
                  subject: message.getSubject(),
                  body: message.getPlainBody()
                  };
}

class Threads {

  constructor(startDate, endDate, dataSheet) {
    this.threads = new Map();
    this.messageIds = new Map();
    this.startDate = startDate;
    this.endDate = endDate;
    this.data = [];
    this.dataSheet = dataSheet;
  }

  getByDateRange(afterDate, beforeDate) {
    // gets threads within a particular date range, saving a reference to each unique thread
    let afterDateString = constructDateString(afterDate);
    let beforeDateString = constructDateString(beforeDate);
    // loop for retrieving threads within the date range in batches of 10
    let firstIndex = 0;
    let nextIndex = 10;
    let threads;
    let query;
    if (QUERY_STR != '') {
      query = `after:${afterDateString} before:${beforeDateString} ${QUERY_STR}`;
    }
    else {
      query = `after:${afterDateString} before:${beforeDateString}`;
    }
    while (true) {
      threads = GmailApp.search(query, firstIndex, nextIndex);
      if (threads.length == 0) break;
      threads.forEach(thread => {
        let threadId = thread.getId();
        if (!this.threads.has(threadId)) this.threads.set(threadId, thread);
      })
    firstIndex = nextIndex;
    nextIndex = nextIndex + 10;
  }
}

  extractMessages() {
    for (const [thid, thread] of this.threads) {
      thread.getMessages().forEach(message => {
        //let labels = thread.getLabels().map(label => label.getName());
        // Don't duplicate messages
        let mid = message.getId();
        if (this.messageIds.has(mid)) return;
        let msgData = extractMessageMetadata(message, mid);
        msgData.threadId = thid;
        // Add thread labels
        //msgData.labels = labels;
        this.data.push(msgData);
        this.messageIds.set(mid, true);
      });
    }
  }

  saveBatch() {
    // Write the current batch of data to the sheet
    let lastRow = this.dataSheet.getLastRow();
    let values = [];
    this.data.forEach(message => {
      // check for excessively long messages
      if (message.body.length > 50000) message.body = message.body.slice(0, 50000);
      let row = [];
      DATA_COLUMNS.forEach(colName => {
        row.push(message[colName]);
      });
      values.push(row);
    });
    if (values.length > 0) {
      this.dataSheet.getRange(lastRow+1, 1, values.length, DATA_COLUMNS.length).setValues(values);
      Logger.log(`${this.data.length} messages saved!`);
    }
    this.data = [];
    SpreadsheetApp.flush();
  }

  getBatch() {
    // Retrieves messages from threads 
    let batchSize = 30;
    let i = 0;
    let d1 = this.startDate;
    let d2;
    Logger.log(`Finding 30-days' worth of messages, starting on  ${d1}`);
    while ((d1 < this.endDate) && (i < batchSize)) {
      d2 = incrementDateRange(d1);
      this.getByDateRange(d1, d2);
      d1 = d2;
      i += 3;
    }
    Logger.log('Retrieving and saving messages.');
    this.extractMessages();
    this.saveBatch();
    // Update the start date for the next batch
    this.startDate = d1;
  }

  getBatches() {
    while (this.startDate < this.endDate) {
      this.getBatch();
    }
  }
}



function constructDateString(date) {
  return date.toISOString().split("T")[0].replace(/-/g, "/");
}

function main() {
  let dataParams = prepSheet();
  let threadObj = new Threads(dataParams.startDate, dataParams.endDate, dataParams.dataSheet);
  threadObj.getBatches();
} 