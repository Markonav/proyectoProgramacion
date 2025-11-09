# API externa

## Nombre 
PayPal REST API

## URL
- **Pruebas:** `https://api-m.sandbox.paypal.com`
- **Vivo:** `https://api-m.paypal.com`
## Endpoints
- **POST** `/v2/checkout/orders`: Crear orden  
- **POST** `/v2/checkout/orders/{order_id}/authorize`: Autorizar fondos  
- **POST** `/v2/checkout/orders/{order_id}/capture`: Capturar pago  
- **GET** `/v2/checkout/orders/{order_id}`: Obtener detalles  
- **PATCH** `/v2/checkout/orders/{order_id}`: Actualizar orden  

## Ejemplo de respuesta
```json 
{
  "id": "9A12345BC6789012D",
  "status": "CREATED",
  "purchase_units": [
    {
      "amount": {
        "currency_code": "CLP",
        "value": "10000"
      }
    }
  ],
  "links": [
    {
      "href": "https://api-m.sandbox.paypal.com/v2/checkout/orders/9A12345BC6789012D",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "https://www.sandbox.paypal.com/checkoutnow?token=9A12345BC6789012D",
      "rel": "approve",
      "method": "GET"
    }
  ]
}

