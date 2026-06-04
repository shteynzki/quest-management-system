namespace :recommender do
  task metrics: :environment do
    puts "=================================================="
    puts "РАСЧЕТ МЕТРИКИ НАДЕЖНОСТИ АЛГОРИТМА (RMSE)"
    puts "=================================================="

    users_with_reviews = User.joins(:reviews).group('users.id').having('count(reviews.id) > 1')
    
    if users_with_reviews.empty?
      puts "Для расчета RMSE нужны пользователи с минимум 2 отзывами."
      return
    end

    errors = []

    users_with_reviews.each do |user|
      reviews = user.reviews.to_a
      
      # Прячем один случайный отзыв (Тестовая выборка)
      hidden_review = reviews.pop 
      
      # Оставшиеся отзывы - тренировочная выборка
      training_reviews = reviews.index_by(&:quest_id)
      
      # Считаем косинусное сходство на урезанных данных
      other_users = User.joins(:reviews).where.not(id: user.id).distinct
      user_similarities = {}
      
      other_users.each do |other_user|
        other_reviews = other_user.reviews.index_by(&:quest_id)
        common_quests = training_reviews.keys & other_reviews.keys
        next if common_quests.empty?

        dot_product = 0.0
        my_norm = 0.0
        other_norm = 0.0

        common_quests.each do |q_id|
          my_r = training_reviews[q_id].score
          other_r = other_reviews[q_id].score
          dot_product += my_r * other_r
          my_norm += my_r**2
          other_norm += other_r**2
        end

        user_similarities[other_user.id] = dot_product / (Math.sqrt(my_norm) * Math.sqrt(other_norm))
      end

      # Предсказываем оценку для спрятанного квеста
      weighted_sum = 0.0
      similarity_sum = 0.0

      user_similarities.each do |other_user_id, sim|
        other_review = Review.find_by(user_id: other_user_id, quest_id: hidden_review.quest_id)
        if other_review
          weighted_sum += sim * other_review.score
          similarity_sum += sim.abs
        end
      end

      if similarity_sum > 0
        predicted_score = weighted_sum / similarity_sum
        actual_score = hidden_review.score
        error = (predicted_score - actual_score)**2
        errors << error
        
        puts "Игрок: #{user.name} | Квест: #{hidden_review.quest.name}"
        puts "  Реальная оценка: #{actual_score}"
        puts "  Предсказанная алгоритмом: #{predicted_score.round(2)}"
        puts "  Погрешность: #{Math.sqrt(error).round(2)} балла"
        puts "-" * 50
      end
    end

    if errors.any?
      rmse = Math.sqrt(errors.sum / errors.size)
      puts "\nИТОГОВЫЙ RMSE СИСТЕМЫ: #{rmse.round(3)}"
      puts "Точность предсказания: #{(100 - (rmse / 5.0 * 100)).round(1)}%"
      puts "=================================================="
    else
      puts "Недостаточно пересечений для расчета."
    end
  end
end