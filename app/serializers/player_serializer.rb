class PlayerSerializer < ActiveModel::Serializer
  attributes :id, :name, :text, :birthplace, :age, :position, :image
end
