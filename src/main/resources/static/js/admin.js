// Функция выполнится автоматически
(function() {

	// Функция выполнится после полной загрузки ресурсов
	document.addEventListener("DOMContentLoaded", function(event){

// ------------------------------------------------------------
// Раньше прочих подгружаются пользователи и роли для новых
// ------------------------------------------------------------

		// Загрузка всех пользователей
		$.ajax({url: '/user/get', type: 'GET', cache: false, dataType: 'json',

			// Успешно
			success: function(resultUser) {

				if (typeof(resultUser) == 'object') {

					if (resultUser.hasOwnProperty('id')) {

						// Обработка полученного списка пользователей
						userEach = resultUser;

						// Пишем кто мы такой
						$("#topbarMenu .navbar-brand strong").html(userEach.email);
						$("#topbarMenu .navbar-brand tt").html(userEach.roles.map(r => r.name).join(', '));

						userEach = null;

					}

				}

			},

			// Ошибка
			error: function(xhr, exception) {
			}

		});

		// *******************************
		// API -> /admin/api [GET]
		// *******************************

		// Загрузка всех пользователей
		$.ajax({url: '/admin/api', type: 'GET', cache: false, dataType: 'json',

			// Перед отправкой очистим окно
			beforeSend: function() {
				$("#tableUsers_ErrorUser").addClass("d-none").removeClass("d-table-row");
			},

			// Успешно
			success: function(resultUsers) {

				if (typeof(resultUsers) == 'object' && resultUsers.length >= 0) {

					if (resultUsers.length == 0) {

						$("#tableUsers_ErrorUser td > p").html("Ошибка загрузки списка пользователей ...");

					} else {

						// Обработка полученного списка пользователей
						var userEach = new Object;
						for (u in resultUsers) {

							userEach = resultUsers[u];
							var userTableRow = $("#tableUsers_SkeletonUser").clone(true);
							$(userTableRow).prop("id", "tableUsers_UID-"+userEach['id']);

							// Каждая ячейка
							$("td:eq(0)", userTableRow).html(userEach.id);
							$("td:eq(1)", userTableRow).html(userEach.username);
							$("td:eq(2)", userTableRow).html(userEach.lastName);
							$("td:eq(3)", userTableRow).html(userEach.age);
							$("td:eq(4)", userTableRow).html(userEach.email);
							$("td:eq(5)", userTableRow).html(userEach.roles.map(r => r.name).join(', '));

							// Каждая кнопка
							$("td:eq(6) button", userTableRow).data('userid', userEach.id);
							$("td:eq(7) button", userTableRow).data('userid', userEach.id);

							$("#tableUsers tbody").append(userTableRow);
							$(userTableRow).removeClass("d-none").show();

						}

						userEach = null;
						userTableRow = null;

					}

				}

			},

			// Ошибка
			error: function(xhr, exception) {
				$("#tableUsers_ErrorUser").addClass("d-table-row").removeClass("d-none");
				$("#tableUsers_ErrorUser td > p").html("Ошибка загрузки списка пользователей ...");
			}

		});

		// *******************************
		// API -> /admin/api/new [GET]
		// *******************************

		// Загрузка ролей для нового пользователя
		$.ajax({url: '/admin/api/new', type: 'GET', cache: false, dataType: 'json',

			// Перед отправкой очистим окно
			beforeSend: function() {

			},

			success: function(result) {

				var resultRoles = result.roles;

				if (resultRoles.length > 0) {
					for (r in resultRoles) {
						$('#formNewUser select[name="roleIds[]"]').append( $("<option>", {"value":resultRoles[r].id, "text": resultRoles[r].name}) );
					}
				}

			},

			// Ошибка
			error: function(xhr, exception) {
				$('#formNewUser select[name="roleIds[]"]').append( $("<option disabled>РОЛИ НЕ ЗАГРУЗИЛИСЬ</option>") );
				$('#formNewUser input[type="submit"]').prop('disabled', true);
			}

		});

// ------------------------------------------------------------
// Модальные окна начинают открываться
// ------------------------------------------------------------

		// Модальное окно редактирования / удаления открывается
		$('.editModal-DIV, .delModal-DIV').on('show.bs.modal', function (event) {

			if (this.id == "modalUserEditDo") {
				$('.modal-body > p.text-muted:eq(0)', event.target).html('Загрузка формы редактирования пользователя ...');
			} else if (this.id == "delModalUser") {
				$('.modal-body > p.text-muted:eq(0)', event.target).html('Загрузка формы удаления пользователя ...');
			}

			// Скрытие формы и отображение индикатора загрузки
			$('.modal-body > p.text-muted:eq(0)', event.target).addClass('d-block').removeClass('d-none');
			$('.modal-body > div.container-fluid:eq(0)', event.target).addClass('d-none').removeClass('d-block');

		});

		// Модальное окно закрылось
		$('.editModal-DIV, .delModal-DIV').on('hidden.bs.modal', function (event) {

			// Скрытие формы и отображение индикатора загрузки
			$('.modal-body > p.text-muted:eq(0)', event.target).addClass('d-block').removeClass('d-none');
			$('.modal-body > div.container-fluid:eq(0)', event.target).addClass('d-none').removeClass('d-block');

		});

// ------------------------------------------------------------
// Функции запроса информации и обновления пользователя
// ------------------------------------------------------------

// Модальное окно редактора открылось - запрос информации пользователя
$('.editModal-DIV').on('shown.bs.modal', function (event) {

	// *******************************
	// API -> /admin/api/user [GET]
	// *******************************

	// ID пользователя в аттрибуте HTML-элемента кнопки вызывающей модальное окно
	let uid = $(event.relatedTarget).data('userid');

	// Загрузка странички редактирования с нужными параметрами
	$.ajax({url: '/admin/api/user?id='+uid, type: 'GET', cache: false, dataType: 'json',

		// Успешно
		success: function(result) {

			// Отображение формы и скрытие индикатора загрузки
			$('.modal-body > p.text-muted:eq(0)', event.target).addClass('d-none').removeClass('d-block');
			$('.modal-body > div.container-fluid:eq(0)', event.target).removeClass('d-none').addClass('d-block');


			// Поле ID
			if (typeof(result.id) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="id"]', event.target).val(result.id);
			}

			// Поле username
			if (typeof(result.username) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="username"]', event.target).val(result.username);
			}

			// Поле lastname
			if (typeof(result.lastName) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="lastName"]', event.target).val(result.lastName);
			}

			// Поле age
			if (typeof(result.age) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="age"]', event.target).val(result.age);
			}

			// Поле email
			if (typeof(result.email) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="email"]', event.target).val(result.email);
			}

			// Поле phone
			if (typeof(result.phone) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="phone"]', event.target).val(result.phone);
			}

			// Поле password
			if (typeof(result.password) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="password"]', event.target).val("");
			}

			// Поле roleIds
			$('.modal-body form:eq(0) select[name="roleIds[]"] option', event.target).remove();
			$('.modal-body form:eq(0) select[name="roleIds[]"]', event.target).prop('disabled', true);

			// Асинхронная, по-умолчанию в jQuery, загрузка доступных ролей
			$.ajax({url: '/admin/api/new', type: 'GET', cache: false, dataType: 'json',
				success: function(resultRoles) {

					var rolesAll = resultRoles.roles;

					if (rolesAll.length > 0) {

						$('.modal-body form:eq(0) select[name="roleIds[]"]', event.target).prop('disabled', false);

						var rolesUserIds = result.roles.map(function(item){
							return item.id;
						});

						var roleSelected = false;
						for (r in rolesAll) {
							roleSelected = rolesUserIds.some(e => e == rolesAll[r].id);
							$('.modal-body form:eq(0) select[name="roleIds[]"]', event.target).append( $("<option>", {"value":rolesAll[r].id, selected: roleSelected, "text": rolesAll[r].name}) );
						}

					}

				},
				error: function(xhr) {
					$('.modal-body form:eq(0) select[name="roleIds[]"]', event.target).append( $("<option disabled>РОЛИ НЕ ЗАГРУЗИЛИСЬ</option>") );
				}
			});

		},

		// Ошибка
		error: function(xhr) {
			$('.modal-body > p.text-muted:eq(0)', event.target).html('Ошибка загрузки формы редактирования пользователя ...');
		}

	});

});

// Форма редактирования отправляется - обновление пользователя
$('#formEditUser').on('submit', function (event) {

	// *******************************
	// API -> /admin/api/update [PUT]
	// *******************************

	// Отключение действия по-умолчанию
	event.preventDefault();

	// ID пользователя в аттрибуте HTML-элемента кнопки вызывающей модальное окно
	let uid = $("input[name='id']", this).val();

	var formData = $("#formEditUser").serializeArray();
	var formObject = {};
	var formJSONText = "";
	var jsonKey = "";

	formData.forEach(item => {

		if (/^.*\[\]$/.test(item.name)) {
			jsonKey = /^(.*?)\[\]$/.exec(item.name)[1];
			if (!formObject.hasOwnProperty(jsonKey)) {
				formObject[jsonKey] = [];
			}
			formObject[jsonKey].push(parseFloat(item.value));
		} else {
			jsonKey = item.name;
			formObject[jsonKey] = item.value;
		}

	});

	formJSONText = JSON.stringify(formObject);

	// Загрузка странички редактирования с нужными параметрами
	$.ajax(
		{url: '/admin/api/update?id='+uid, data: formJSONText, type: 'PUT', cache: false, dataType: 'json',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

		// Перед отправкой отключим кнопку редактирования
		beforeSend: function() {
			$("#modalUserEditDo button[type='submit']").prop('disabled', true);
		},

		// После отправки включим кнопку редактирования
		complete: function() {
			$("#modalUserEditDo button[type='submit']").prop('disabled', false);
		},

		// Успешно
		success: function(resultUpdate) {

			var editedUserTableRow = $("#tableUsers_UID-"+uid);

			// Каждая ячейка
			$("td:eq(0)", editedUserTableRow).html(resultUpdate.id);
			$("td:eq(1)", editedUserTableRow).html(resultUpdate.username);
			$("td:eq(2)", editedUserTableRow).html(resultUpdate.lastName);
			$("td:eq(3)", editedUserTableRow).html(resultUpdate.age);
			$("td:eq(4)", editedUserTableRow).html(resultUpdate.email);
			$("td:eq(5)", editedUserTableRow).html(resultUpdate.roles.map(r => r.name).join(', '));

			$("#modalUserEditDo").modal('hide');

			// Подсветка отредактированной строки
			$(editedUserTableRow).css("transition", "1.5s all").delay(300).queue(function(){
				$(this).addClass("bg-info").dequeue();
				document.getElementById("formNewUser").reset();
			}).delay(2000).queue(function(){
				$(this).removeClass("bg-info").dequeue();
				$(this).removeAttr("style");
			});


		},

		// Ошибка
		error: function(xhr, exception) {
			alert('Ошибка получения ответа');
		}

	});

});

// ------------------------------------------------------------
// Функции запроса информации для удаления пользователя
// ------------------------------------------------------------

// Модальное окно удаления открывается - запрос информации для удаления
$('.delModal-DIV').on('shown.bs.modal', function (event) {

	// *******************************
	// API -> /admin/api/user [GET]
	// *******************************

	// ID пользователя в аттрибуте HTML-элемента кнопки вызывающей модальное окно
	let uid = $(event.relatedTarget).data('userid');

	// Загрузка странички удаления с нужными параметрами
	$.ajax({url: '/admin/api/user?id='+uid, type: 'GET', cache: false, dataType: 'json',

		// Успешно
		success: function(result) {

			// Отображение формы и скрытие индикатора загрузки
			$('.modal-body > p.text-muted:eq(0)', event.target).addClass('d-none').removeClass('d-block');
			$('.modal-body > div.container-fluid:eq(0)', event.target).removeClass('d-none').addClass('d-block');

			// Поле ID
			if (typeof(result.id) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="id"]', event.target).val(result.id);
			}

			// Поле username
			if (typeof(result.username) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="username"]', event.target).val(result.username);
			}

			// Поле lastname
			if (typeof(result.lastName) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="lastName"]', event.target).val(result.lastName);
			}

			// Поле age
			if (typeof(result.age) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="age"]', event.target).val(result.age);
			}

			// Поле email
			if (typeof(result.email) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="email"]', event.target).val(result.email);
			}

			// Поле phone
			if (typeof(result.phone) !== 'undefined') {
				$('.modal-body form:eq(0) input[name="phone"]', event.target).val(result.phone);
			}

			// Поле roleIds
			$('.modal-body form:eq(0) select[name="roleIds[]"] option', event.target).remove();

			var rolesAll = result.roles;
			for (r in rolesAll) {
				$('.modal-body form:eq(0) select[name="roleIds[]"]', event.target).append( $("<option>", {"value":rolesAll[r].id, "text": rolesAll[r].name}) );
			}

		},

		// Ошибка
		error: function(xhr) {
			$('.modal-body > p.text-muted:eq(0)', event.target).html('Ошибка загрузки формы удаления пользователя ...');
		}

	});

});

// Форма удаления отправляется
$('#formDeleteUser').on('submit', function (event) {

	// *******************************
	// API -> /admin/api/delete [DELETE]
	// *******************************

	// Отключение действия по-умолчанию
	event.preventDefault();

	// ID пользователя в аттрибуте HTML-элемента кнопки вызывающей модальное окно
	let uid = $("input[name='id']", this).val();

	// Загрузка странички редактирования с нужными параметрами
	$.ajax({url: '/admin/api/delete?id='+uid, type: 'DELETE', cache: false, dataType: 'text',

		// Перед отправкой отключим кнопку удаления
		beforeSend: function() {
			$("#modalUserDelDo button[type='submit']").prop('disabled', true);
		},

		// После отправки включим кнопку удаления
		complete: function() {
			$("#modalUserDelDo button[type='submit']").prop('disabled', false);
		},

		// Успешно
		success: function(resultDelete) {
			$("#modalUserDelDo").modal('hide');
			$("#tableUsers_UID-"+uid).addClass("alert-danger").hide(1500, function(){
				$(this).remove();
			});
		},

		// Ошибка
		error: function(xhr, exception) {
			alert('Ошибка получения ответа на запрос удаление пользователя');
		}

	});

});

// Форма добавления отправляется
$('#formNewUser').on('submit', function (event) {

	// *******************************
	// API -> /admin/api/new [POST]
	// *******************************

	// Отключение действия по-умолчанию
	event.preventDefault();

	// Данные нового пользователя
	var formData = $("#formNewUser").serializeArray();
	var formObject = {};
	var formJSONText = "";
	var jsonKey = "";

	formData.forEach(item => {

		if (/^.*\[\]$/.test(item.name)) {
			jsonKey = /^(.*?)\[\]$/.exec(item.name)[1];
			if (!formObject.hasOwnProperty(jsonKey)) {
				formObject[jsonKey] = [];
			}
			formObject[jsonKey].push(parseFloat(item.value));
		} else {
			jsonKey = item.name;
			formObject[jsonKey] = item.value;
		}

	});

	formJSONText = JSON.stringify(formObject);

	// Отправка данных для создания нового пользователя
	$.ajax({url: '/admin/api/new', data: formJSONText, type: 'POST', cache: false, dataType: 'json',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },

		// Перед отправкой отключим кнопку добавления
		beforeSend: function() {
			$("#formNewUser button[type='submit']").prop('disabled', true);
		},

		// После отправки вернём кнопку добавления
		complete: function() {
			$("#formNewUser button[type='submit']").prop('disabled', false);
		},

		// Успешно
		success: function(resultNew) {

			var userTableRow = $("#tableUsers_SkeletonUser").clone(true);
			$(userTableRow).prop("id", "tableUsers_UID-"+resultNew.id);

			// Каждая ячейка
			$("td:eq(0)", userTableRow).html(resultNew.id);
			$("td:eq(1)", userTableRow).html(resultNew.username);
			$("td:eq(2)", userTableRow).html(resultNew.lastName);
			$("td:eq(3)", userTableRow).html(resultNew.age);
			$("td:eq(4)", userTableRow).html(resultNew.email);
			$("td:eq(5)", userTableRow).html(resultNew.roles.map(r => r.name).join(', '));

			// Каждая кнопка
			$("td:eq(6) button", userTableRow).data('userid', resultNew.id);
			$("td:eq(7) button", userTableRow).data('userid', resultNew.id);

			$("#tableUsers tbody").append(userTableRow);
			$(userTableRow).removeClass("d-none").show();

			var tabListTab = new bootstrap.Tab(document.querySelector('#tabUsersListTab'));
			tabListTab.show();

			// Подсветка новой строки
			$(userTableRow).removeClass("d-none").css("transition", "1.5s all").delay(300).queue(function(){
				$(this).addClass("bg-success").dequeue();
				document.getElementById("formNewUser").reset();
			}).delay(2000).queue(function(){
				$(this).removeClass("bg-success").dequeue();
				$(this).removeAttr("style");
			});

		},

		// Ошибка
		error: function(xhr, exception) {
			alert('Ошибка получения ответа на запрос добавления пользователя');
		}

	});

});

	// DOMContentLoaded
	});

// function
})();