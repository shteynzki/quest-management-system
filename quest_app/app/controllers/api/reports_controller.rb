class Api::ReportsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_game

  def analyze_photo
    unless params[:blank_photo].present?
      render json: { error: "Фото не загружено" }, status: :bad_request
      return
    end

    begin
      image = MiniMagick::Image.open(params[:blank_photo].path)
      image.format "jpg"
      image.colorspace "Gray"
      image.contrast
      image.normalize

      processed_path = Rails.root.join('tmp', "ocr_#{Time.now.to_i}.jpg")
      image.write(processed_path)

      ocr = RTesseract.new(processed_path.to_s, lang: 'rus+eng', psm: 6)
      raw_text = ocr.to_s
      
      text_for_numbers = raw_text.gsub(/S/i, '5').gsub(/[OJ]/i, '0')

      price_match = text_for_numbers.match(/(?:MECTE|МЕСТЕ|СУММА|rant|AbILIN|MECT|MEC)[\s\W]*(\d[\s\.]*\d[\s\.]*\d[\s\.]*\d?)/i)
      clean_amount = price_match ? price_match[1].gsub(/[\s\.]/, '').to_i : nil

      discount_match = text_for_numbers.match(/(?:СКИДКА|CKHAKA|CKMAKA|CKUGKA|CКИДKA|CKM|CK)[\s\W]*(\d{2,4})/i)
      discount_val = discount_match ? discount_match[1].to_i : nil

      player_numbers = text_for_numbers.scan(/(?:^|\s|\||\[)(\d)\s*[\)\.\]]/).flatten.map(&:to_i).select { |n| n > 0 && n <= 15 }
      players_count = player_numbers.max if player_numbers.any?

      File.delete(processed_path) if File.exist?(processed_path)

      render json: {
        actual_amount: clean_amount,
        discount_custom: discount_val,
        players_count: players_count
      }, status: :ok
    rescue => e
      render json: { error: "Ошибка OCR: #{e.message}" }, status: :unprocessable_entity
    end
  end

  def create
    report = @game.build_report(report_params)
    if report.save
      render json: { message: "Отчет успешно сохранен" }, status: :created
    else
      render json: { errors: report.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_game
    @game = Game.find(params[:game_id])
  end

  def report_params
    params.require(:report).permit(
      :source_type, :source_name, :actual_actor_id, :payment_method,
      :players_count, :discount_type, :discount_custom, :photo_sold,
      :photo_payment, :extra_expenses, :comment, :calculated_amount,
      :actual_amount, :amount_mismatch_reason
    )
  end
end