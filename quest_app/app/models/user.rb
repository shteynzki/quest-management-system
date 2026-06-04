class User < ApplicationRecord

  has_many :games, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :actor_schedules, dependent: :destroy
  has_many :actor_transactions, dependent: :destroy
  has_many :quest_views, dependent: :destroy
  has_secure_password
  validates :name, presence: true
  validates :last_name, presence: true
  validates :role, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  enum :role, { player: 0, actor: 1, admin: 2 }
  
  def full_name
    "#{name} #{last_name}"
  end
def recommended_quests(limit_count = 3)
    # Теперь ищем историю и в играх, и в отзывах
    played_quest_ids = (games.pluck(:quest_id) + reviews.pluck(:quest_id)).uniq
    viewed_quest_ids = quest_views.pluck(:quest_id).uniq
    
    return Quest.none if played_quest_ids.empty? && viewed_quest_ids.empty?

    tag_weights = Hash.new(0)
    
    QuestTag.where(quest_id: viewed_quest_ids).each do |qt|
      tag_weights[qt.tag_id] += 1
    end

    QuestTag.where(quest_id: played_quest_ids).each do |qt|
      tag_weights[qt.tag_id] += 5
    end
    
    top_tag_ids = tag_weights.sort_by { |_tag_id, weight| -weight }.first(5).map(&:first)

    Quest.joins(:quest_tags)
         .where(quest_tags: { tag_id: top_tag_ids })
         .where.not(id: played_quest_ids)
         .group('quests.id')
         .order(Arel.sql('COUNT(quest_tags.tag_id) DESC'))
         .limit(limit_count)
  end
end