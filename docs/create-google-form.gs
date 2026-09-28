/**
 * Creates the CA1 survey "Lifestyle Habits and Metabolic Health Awareness"
 * in Google Forms, with a linked response spreadsheet.
 *
 * How to run:
 *   1. Go to https://script.google.com → New project
 *   2. Replace the default code with this file, save
 *   3. Select `createSurvey` → Run → allow the permissions
 *   4. View → Logs (or Execution log) for the form links
 *
 * Question design: docs/survey-design.md
 */

// Whole numbers in a range, enforced with a regex (Forms can't combine
// "whole number" and "between" in one rule)
const WHOLE = {
  age18to99: '^(1[89]|[2-9][0-9])$',
  to100: '^([0-9]|[1-9][0-9]|100)$',
  to600: '^([0-9]|[1-9][0-9]|[1-5][0-9]{2}|600)$',
};

function wholeNumber(pattern, help) {
  return FormApp.createTextValidation()
    .setHelpText(help)
    .requireTextMatchesPattern(pattern)
    .build();
}

function numberBetween(min, max, help) {
  return FormApp.createTextValidation()
    .setHelpText(help)
    .requireNumberBetween(min, max)
    .build();
}

function createSurvey() {
  const form = FormApp.create('Lifestyle Habits and Metabolic Health Awareness');

  form
    .setDescription(
      'This anonymous survey is part of an academic assignment for the Higher Diploma in ' +
      'Data Analytics at CCT College Dublin. It asks about everyday lifestyle habits ' +
      '(activity, sitting, sleep, sugary drinks) and awareness of metabolic health.\n\n' +
      '• The data is collected for academic purposes only and will not be used commercially ' +
      'or shared with third parties.\n' +
      '• No names, email addresses or other identifying details are collected. All responses ' +
      'are anonymised before analysis.\n' +
      '• Participation is voluntary. Questions marked optional can be skipped, and you can ' +
      'stop at any time before submitting.\n' +
      '• You must be 18 or older to take part.\n' +
      '• This survey does not provide medical advice or diagnosis.\n\n' +
      'By submitting this survey, you confirm you have read this notice and agree to your ' +
      'anonymous answers being used for this academic project.\n\n' +
      'It takes about 3–4 minutes. Thank you!'
    )
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(false)
    .setProgressBar(true)
    .setConfirmationMessage('Thank you for taking part! Your anonymous response has been recorded.');

  // ---- Consent ----------------------------------------------------------
  form.addCheckboxItem()
    .setTitle('I have read the notice above and agree to take part.')
    .setChoiceValues(['I agree'])
    .setRequired(true);

  // ---- Section A: About you ---------------------------------------------
  form.addPageBreakItem().setTitle('About You');

  form.addTextItem()
    .setTitle('What is your age?')
    .setHelpText('In years, e.g. 34')
    .setValidation(wholeNumber(WHOLE.age18to99, 'Please enter a whole number between 18 and 99.'))
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('What is your gender?')
    .setChoiceValues(['Female', 'Male', 'Non-binary', 'Prefer not to say'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Which best describes your current situation?')
    .setChoiceValues(['Working full-time', 'Working part-time', 'Studying only', 'Studying and working'])
    .showOtherOption(true)
    .setRequired(true);

  // ---- Section B: Activity and lifestyle ---------------------------------
  form.addPageBreakItem()
    .setTitle('Activity and Lifestyle')
    .setHelpText(
      'Moderate activity makes you breathe harder than normal, e.g. brisk walking, ' +
      'cycling, swimming, gym, sports.'
    );

  form.addScaleItem()
    .setTitle('In a typical week, on how many days do you do at least 10 minutes of moderate or vigorous activity?')
    .setBounds(0, 7)
    .setLabels('No days', 'Every day')
    .setRequired(true);

  form.addTextItem()
    .setTitle('On those days, roughly how many minutes are you active in total?')
    .setHelpText('Minutes per active day. Enter 0 if none.')
    .setValidation(wholeNumber(WHOLE.to600, 'Please enter a whole number between 0 and 600.'))
    .setRequired(true);

  form.addTextItem()
    .setTitle('On a typical weekday, how many hours do you spend sitting (work, study, commuting, screens)?')
    .setHelpText('Decimals are fine, e.g. 7.5')
    .setValidation(numberBetween(0, 24, 'Please enter a number of hours between 0 and 24.'))
    .setRequired(true);

  form.addTextItem()
    .setTitle('On average, how many hours do you sleep per night?')
    .setHelpText('Decimals are fine, e.g. 6.5')
    .setValidation(numberBetween(2, 14, 'Please enter a number of hours between 2 and 14.'))
    .setRequired(true);

  form.addTextItem()
    .setTitle('How many sugary drinks (soft drinks, energy drinks, sweetened coffees) do you have per week?')
    .setHelpText('Enter 0 if none.')
    .setValidation(wholeNumber(WHOLE.to100, 'Please enter a whole number between 0 and 100.'))
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Do you use a fitness tracker or smartwatch to monitor activity?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(true);

  // ---- Section C: Body measurements (optional) ---------------------------
  form.addPageBreakItem()
    .setTitle('Body Measurements (Optional)')
    .setHelpText("These questions are optional. Skip them or choose 'Prefer not to say' if you prefer.");

  form.addTextItem()
    .setTitle('What is your height in centimetres? (optional)')
    .setHelpText('e.g. 172')
    .setValidation(numberBetween(120, 220, 'Please enter a height between 120 and 220 cm.'))
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Which range best describes your weight? (optional)')
    .setChoiceValues([
      'Under 50 kg', '50–59 kg', '60–69 kg', '70–79 kg', '80–89 kg',
      '90–99 kg', '100–109 kg', '110 kg or more', 'Prefer not to say',
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('Compared with 2 years ago, has your waist or trouser size increased? (optional)')
    .setChoiceValues(['Yes', 'No', 'Not sure'])
    .setRequired(false);

  // ---- Section D: Health awareness ---------------------------------------
  form.addPageBreakItem().setTitle('Health Awareness');

  form.addMultipleChoiceItem()
    .setTitle('Before today, had you heard of "insulin resistance"?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('When did you last have a routine blood test?')
    .setChoiceValues(['Within the last year', '1–2 years ago', 'More than 2 years ago', 'Never', 'Not sure'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('How would you rate your overall health?')
    .setBounds(1, 5)
    .setLabels('Very poor', 'Excellent')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('How concerned are you about developing type 2 diabetes in the future?')
    .setBounds(1, 5)
    .setLabels('Not at all', 'Very concerned')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('How likely would you be to use a free online tool that estimates your metabolic health risk from lifestyle questions?')
    .setBounds(1, 5)
    .setLabels('Very unlikely', 'Very likely')
    .setRequired(true);

  // ---- Responses spreadsheet ---------------------------------------------
  const sheet = SpreadsheetApp.create('Lifestyle Habits Survey (Responses)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Share this link:  ' + form.getPublishedUrl());
  Logger.log('Edit the form:    ' + form.getEditUrl());
  Logger.log('Responses sheet:  ' + sheet.getUrl());
}
