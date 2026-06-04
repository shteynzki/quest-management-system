namespace :recommender do
  task evaluate: :environment do
    require 'benchmark'

    users = User.joins(:reviews).distinct.limit(5)

    puts "=================================================="
    puts "СРАВНИТЕЛЬНЫЙ АНАЛИЗ РЕКОМЕНДАТЕЛЬНЫХ СИСТЕМ"
    puts "=================================================="

    users.each do |user|
      puts "Пользователь: #{user.name} #{user.last_name} (ID: #{user.id})"
      puts "Оцененных квестов: #{user.reviews.count}"

      recommender = Recommender.new(user)

      content_time = Benchmark.realtime do
        @content_recs = recommender.content_based(3)
      end

      collab_time = Benchmark.realtime do
        @collab_recs = recommender.collaborative_filtering(3)
      end

      puts "  [Контентная фильтрация (по тегам)]"
      puts "  Время выполнения: #{(content_time * 1000).round(2)} мс"
      puts "  Рекомендации: #{@content_recs.any? ? @content_recs.map(&:name).join(', ') : 'Нет данных'}"
      puts ""
      puts "  [Коллаборативная фильтрация (User-based)]"
      puts "  Время выполнения: #{(collab_time * 1000).round(2)} мс"
      puts "  Рекомендации: #{@collab_recs.any? ? @collab_recs.map(&:name).join(', ') : 'Нет совпадений'}"
      puts "--------------------------------------------------"
    end
  end
end