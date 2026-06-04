class Recommender
  def initialize(user)
    @user = user
  end

  # 1. Контентная фильтрация (уже написана в модели User, просто вызываем)
  def content_based(limit = 3)
    @user.recommended_quests(limit)
  end

  # 2. Коллаборативная фильтрация (User-based)
  def collaborative_filtering(limit = 3)
    my_reviews = @user.reviews.index_by(&:quest_id)
    
    # Если пользователь еще ничего не оценил, коллаборативная фильтрация не сработает (проблема "Холодного старта")
    return [] if my_reviews.empty?

    # Ищем других пользователей, которые тоже оставляли отзывы
    other_users = User.joins(:reviews).where.not(id: @user.id).distinct
    user_similarities = {}
    
    other_users.each do |other_user|
      other_reviews = other_user.reviews.index_by(&:quest_id)
      
      # Ищем пересечения: квесты, которые оценили оба пользователя
      common_quests = my_reviews.keys & other_reviews.keys
      next if common_quests.empty?

      # Считаем косинусное сходство (Cosine Similarity)
      dot_product = 0.0
      my_norm = 0.0
      other_norm = 0.0

      common_quests.each do |q_id|
        my_r = my_reviews[q_id].score
        other_r = other_reviews[q_id].score
        
        dot_product += my_r * other_r
        my_norm += my_r**2
        other_norm += other_r**2
      end

      similarity = dot_product / (Math.sqrt(my_norm) * Math.sqrt(other_norm))
      user_similarities[other_user.id] = similarity
    end

    return [] if user_similarities.empty?

    # Прогнозируем оценки для квестов, в которые наш пользователь еще не играл
    unplayed_quests = Quest.where.not(id: my_reviews.keys)
    predictions = {}

    unplayed_quests.each do |quest|
      weighted_sum = 0.0
      similarity_sum = 0.0

      user_similarities.each do |other_user_id, sim|
        other_review = Review.find_by(user_id: other_user_id, quest_id: quest.id)
        if other_review
          weighted_sum += sim * other_review.score
          similarity_sum += sim.abs
        end
      end

      if similarity_sum > 0
        predictions[quest] = weighted_sum / similarity_sum
      end
    end

    # Сортируем квесты по предсказанной оценке (по убыванию) и отдаем Топ-K
    predictions.sort_by { |_quest, pred_score| -pred_score }.first(limit).map(&:first)
  end

  # Гибридная система (решает проблему холодного старта)
  def hybrid_recommendations(limit = 3)
    collab_recs = collaborative_filtering(limit)
    
    if collab_recs.any?
      collab_recs
    else
      # Если коллаборативная не справилась (нет отзывов), отдаем контентную
      content_based(limit)
    end
  end
end