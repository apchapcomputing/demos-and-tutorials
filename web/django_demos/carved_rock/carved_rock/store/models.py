from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    stock_count = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(default="")
    sku = models.CharField(max_length=20, verbose_name="Stock Keeping Unit", unique=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    image = models.ImageField()
    product = models.ForeignKey("Product", on_delete=models.CASCADE, related_name="images")

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    products = models.ManyToManyField('Product', related_name="categories")

    def __str__(self):
        return self.name
