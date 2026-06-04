class Quest < ApplicationRecord
  has_many :games, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :quest_tags, dependent: :destroy
  has_many :tags, through: :quest_tags

  def similar_quests(limit_count = 3)
    Quest.joins(:quest_tags)
         .where(quest_tags: { tag_id: self.tag_ids })
         .where.not(id: self.id)
         .group('quests.id')
         .order(Arel.sql('COUNT(quest_tags.tag_id) DESC'))
         .limit(limit_count)
  end
end