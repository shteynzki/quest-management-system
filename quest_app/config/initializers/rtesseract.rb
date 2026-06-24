RTesseract.configure do |config|
  config.command = ENV.fetch('TESSERACT_COMMAND', 'tesseract')
end
