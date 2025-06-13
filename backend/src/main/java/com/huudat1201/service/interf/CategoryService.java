package com.huudat1201.service.interf;

import com.huudat1201.dto.CategoryDto;
import com.huudat1201.dto.Response;

public interface CategoryService {
    Response createCategory(CategoryDto categoryRequest);
    Response updateCategory(Long categoryId, CategoryDto categoryRequest);
    Response getAllCategories();
    Response getCategoryById(Long categoryId);
    Response deleteCategory(Long categoryId);
}
