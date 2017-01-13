
function onDeleteClick() {
  var result = confirm("{% trans 'このアイテムを削除しますか？' %}")
  if (result === true) {
    location.href = "{% url 'wardrobe:delete' pk=user_item.pk %}"
  }

  return false
}