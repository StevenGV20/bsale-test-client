const remote_host = "https://bsale-test-server.herokuapp.com";
const css_pag_active =
  "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 border-2 py-2 px-3 xl:px-4 text-sm";
const css_pag_no_active =
  "border hover:bg-gray-300 py-2 px-3 xl:px-4 text-sm text-gray-900";
const css_categori_no_active =
  "nav-link active text-white fw-bolder hover:bg-gray-700 uppercase itemCategory";

function errorImage(e) {
  console.log(e);
  e.src = "./img/image-not-found.png";
}

function listCategories(api) {
  $.ajax({
    type: "GET",
    url: api,
    success: function (data) {
      $.each(data, (index, cat) => {
        $("#idCategories").append(`
                  <li class="nav-item">
                  <a href="#${cat.idcategory}" class="nav-link active text-white fw-bolder hover:bg-gray-700 uppercase itemCategory">
                      ${cat.name}
                  </a>
                  </li>
                  `);
        $("#idCategoriesMobile").append(`
                  <a href="#${cat.idcategory}" class="text-gray-700 block px-4 py-2 text-sm capitalize itemCategory mobile" tabindex="-1">${cat.name}</a>
              `);
      });
    },
    error: (error) => {
      console.log("Hubo un error");
    },
  });
}

function loadProducts(data) {
  var icon_cart = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                    <path d="M14 36c-2.21 0-3.98 1.79-3.98 4s1.77 4 3.98 4 4-1.79 4-4-1.79-4-4-4zm-12-32v4h4l7.19 15.17-2.7 
                      4.9c-.31.58-.49 1.23-.49 1.93 0 2.21 1.79 4 4 4h24v-4h-23.15c-.28 0-.5-.22-.5-.5 0-.09.02-.17.06-.24l1.79-3.26h14.9c1.5 
                      0 2.81-.83 3.5-2.06l7.15-12.98c.16-.28.25-.61.25-.96 0-1.11-.9-2-2-2h-29.57l-1.9-4h-6.53zm32 32c-2.21 0-3.98 1.79-3.98 4s1.77 
                      4 3.98 4 4-1.79 4-4-1.79-4-4-4z"/><path fill="none" d="M0 0h48v48h-48z"/>
                  </svg>
                `;
  data.map((pro) => {
    $("#idProducts").append(`
              <div class="group relative bg-gray-50 p-3 shadow-lg">
              <div class="w-auto min-h-80 bg-white aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img src="${
                    pro.urlImage
                  }" onerror="errorImage(this)" class="w-full h-full object-center object-contain lg:w-full lg:h-full">
                  <div class="absolute right-8 lg:right-10 top-50 md:top-54 lg:top-60">
                  ${
                    pro.discount > 0
                      ? '<p class="text-lg font-bold text-gray-700 rounded-full bg-gray-200 w-12 pl-1 pr-2 py-2 text-center">' +
                        pro.discount +
                        "%</p>"
                      : ""
                  }
                  </div>
              </div>
              <div class="mt-4 flex justify-between">
                  <div>
                  <h3 class="text-sm text-gray-700">
                      <a href="#">
                      <span aria-hidden="true" class="absolute inset-0"></span>
                      ${pro.name}
                      </a>
                  </h3>
                  <p class="mt-1 text-xl font-medium text-black">$${
                    pro.price
                  }</p>
                  </div>
                  <div class="block text-center">
                  <p class="text-sm font-bold text-red-900">${icon_cart}</p>
                  </div>
              </div>
              </div>
          `);
    $("#idSpinner").css("display", "none");
  });
}

function loadPagination(pages) {
  if (pages > 1) {
    for (var i = 1; i < pages + 1; i++) {
      $(".idPaginacion").append(
        `<li class='page-item'><button class='${
          i == 1 ? css_pag_active : css_pag_no_active
        }' id='idNumPage'>${i}</button></li>`
      );
    }
  }
}

function listProducts(api, cat, filter, page, loadPages) {
  console.log(
    "properties: api,page,filter,cat: ",
    `${api}?page=${page}&cat=${cat}&type=${filter}`
  );
  $("#idProducts").empty();
  $("#idSpinner").css("display", "flex");
  $("#idErrorLoading").css("display", "none");
  $("#idMessageSearch").css("display", "none");
  $("#idErrorLoading").empty();
  $.ajax({
    type: "GET",
    url: `${api}?cat=${cat}&page=${page}&type=${filter}`,
    success: function (data) {
      loadProducts(data.content);
      if (data.length < 1) {
        $("#idSpinner").css("display", "none");
        $("#idErrorLoading").css("display", "flex");
        $("#idErrorLoading").html(`<span>No hay productos registrados</span>`);
      }
      if (loadPages) loadPagination(data.totalPages);
    },
    error: (error) => {
      console.log("Hubo un error", error);
      $("#idSpinner").css("display", "none");
      $("#idErrorLoading").css("display", "flex");
      $("#idErrorLoading").html(
        `<span>Hubo un error al consultar los productos</span>`
      );
    },
  });
}

function listProductsByName(api, name) {
  $("#idProducts").empty();
  $(".idPaginacion").empty();
  $("#idErrorLoading").empty();
  $("#idSpinner").css("display", "flex");
  $("#idErrorLoading").css("display", "none");
  $("#idMessageSearch").css("display", "none");
  $.ajax({
    type: "GET",
    url: `${api}?name=${name}`,
    success: function (data) {
      if (data.length < 1) {
        $("#idSpinner").css("display", "none");
        $("#idErrorLoading").css("display", "flex");
        $("#idErrorLoading").html(
          `<span>No hay ningun producto con ese nombre</span>`
        );
      } else {
        $("#idMessageSearch").css("display", "flex");
        $("#idMessageSearch").text(
          `Se han encontrado ${data.length} ${
            data.length > 1 ? "resultados" : "resultado"
          } para el producto '${name}'.`
        );
        loadProducts(data);
      }
    },
    error: (error) => {
      console.log(error);
      $("#idSpinner").css("display", "none");
      $("#idErrorLoading").css("display", "flex");
      $("#idErrorLoading").html(`<span>Hubo un error al consultar</span>`);
    },
  });
}

$(document).on("click", ".itemCategory", function () {
  const element = $(this);
  const idCat = element.attr("href").replace("#", "");

  const class_cat = $(this).attr("class").includes("mobile");

  if (!class_cat) {
    $(".itemCategory").attr("class", css_categori_no_active);
    element.attr("class", css_categori_no_active + " bg-gray-700 text-white");
  }

  $("#idCategory").val(idCat);
  $("#idCatActual").text(element.text());
  $("#idFilterActual").text("Recomendado");

  $(".idPaginacion").empty();
  const api_product = `${remote_host}/api/product/filter`;
  listProducts(api_product, idCat, "All", 0, true);
});

$(document).on("click", "#idNumPage", function () {
  $(".idPaginacion li button").attr("class", css_pag_no_active);

  const page = parseInt($(this).text()) - 1;
  $(".idPaginacion > li > button").map((index, btn) => {
    console.log();
    if ($(btn).text() == page + 1) {
      $(btn).attr("class", css_pag_active);
    }
  });
  const api_product = `${remote_host}/api/product/filter`;
  listProducts(
    api_product,
    $("#idCategory").val(),
    $("#filterValue").text(),
    page,
    false
  );
});

$(document).ready(function () {
  const api_category = `${remote_host}/api/category/`;
  const api_product = `${remote_host}/api/product/listAll`;

  listCategories(api_category);
  listProducts(api_product, 0, "All", 0, true);

  $(".filteritem").click(function () {
    const element = $(this);
    var attr_val = $(this).attr("href").replace("#", "");
    var cat_val = $("#idCategory").val();

    $("#idFilterActual").text(element.text());
    $("#filterValue").val(attr_val);
    $(".idPaginacion").empty();

    const api = `${remote_host}/api/product/filter`;
    listProducts(api, cat_val, attr_val, 0, true);
  });

  $("#idSearchProduct").keyup(function (e) {
    const api = `${remote_host}/api/product/listByName`;
    $(".idPaginacion").empty();
    if (e.target.value.trim().length > 0) {
      listProductsByName(api, e.target.value);
      $("#idContainerFiltros").css("display", "none");
    } else {
      listProducts(api_product, 0, "All", 0, true);
      $("#idContainerFiltros").css("display", "flex");
      $("#idMessageSearch").css("display", "none");
    }
  });
});
