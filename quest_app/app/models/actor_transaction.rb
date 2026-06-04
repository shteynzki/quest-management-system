class ActorTransaction < ApplicationRecord
  belongs_to :user
  belongs_to :game, optional: true

  RATES = {
    'dirty' => -20,
    'no_report' => -15,
    'report_error' => -5,
    'no_upsell' => -15,
    'late_15' => -15,
    'late_game' => -50,
    'light_on' => -30,
    'no_consumables' => -15,
    'no_breakage_report' => -25,
    'skip_warned' => -60,
    
    'photo' => 10,
    'repair' => 14,
    'replacement' => 5,
    'content_solo' => 12,
    'content_duo' => 6,
    'content_trio' => 3,
    'review_aggr_solo' => 12,
    'review_aggr_duo' => 6,
    'review_maps_solo' => 4,
    'review_maps_duo' => 2,
    'return_upsell' => 12,
    'initiative' => 17
  }
end